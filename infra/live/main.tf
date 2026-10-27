# The GCP baseline, CI/CD identity, and one Cloud Run service.
#
# Retargeted from ordersmart-prod's own infra/live/main.tf — same module
# library, same shape. The one real difference: this project has no
# separate API service. The contact form is a Next.js Route Handler inside
# the same app (web/app/api/contact/route.ts), so there is no circular
# web-image-needs-the-api's-URL dependency to route around — a plain
# `tofu apply` works here once the one secret container has a version (see
# ../apply.sh, much shorter than ordersmart's for exactly that reason).
#
# module.dns is NOT included: mahanthltd.co.uk's DNS stays wherever it's
# already registered, not this project's own Cloud DNS (which doesn't
# exist) — module.hosting's own required_dns_updates output below gives the
# handful of records its custom-domain verification needs, added directly
# at that existing DNS.

terraform {
  required_version = ">= 1.8"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 8.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 8.0"
    }
  }

  backend "gcs" {
    # bucket is supplied by -backend-config so this file carries no account
    # detail; see README.
    prefix = "project"
  }
}

# Firebase Hosting resources exist only in the beta provider — see
# module.hosting's own comment for why this project needs it at all despite
# everything else living in the GA provider.
provider "google-beta" {
  project               = var.project_id
  region                = var.region
  user_project_override = true
  billing_project       = var.project_id
}

provider "google" {
  project = var.project_id
  region  = var.region

  # billingbudgets refuses a request authenticated by local Application
  # Default Credentials unless a quota project is attached.
  user_project_override = true
  billing_project       = var.project_id
}

module "baseline" {
  source = "git::ssh://git@github.com/Durairaj/infra.git//modules/gcp-project-baseline?ref=v0.6.0"

  project_id          = var.project_id
  billing_account     = var.billing_account
  region              = var.region
  monthly_budget      = var.monthly_budget
  artifact_repository = "mahanthltd"
}

output "project_number" {
  value = module.baseline.project_number
}

output "registry" {
  description = "Tag images with this prefix."
  value       = module.baseline.registry
}

# ------------------------------------------------------------------ CI/CD

module "github_deploy" {
  source = "git::ssh://git@github.com/Durairaj/infra.git//modules/gcp-github-deploy?ref=v0.6.0"

  project_id        = var.project_id
  github_repository = var.github_repository

  enable_terraform_identity   = true
  enable_build_staging_bucket = true
  region                      = var.region
  billing_account             = var.billing_account
}

output "github_workload_identity_provider" {
  description = "Repository variable GCP_WORKLOAD_IDENTITY_PROVIDER."
  value       = module.github_deploy.workload_identity_provider
}

output "build_staging_bucket" {
  description = "Repository variable GCP_BUILD_STAGING_BUCKET."
  value       = module.github_deploy.build_staging_bucket
}

output "github_terraform_service_account" {
  description = "Repository variable GCP_TERRAFORM_SERVICE_ACCOUNT."
  value       = module.github_deploy.terraform_service_account_email
}

output "github_deploy_service_account" {
  description = "Repository variable GCP_DEPLOY_SERVICE_ACCOUNT."
  value       = module.github_deploy.deploy_service_account_email
}

# --------------------------------------------------------------- Cloud Run

module "web" {
  source = "git::ssh://git@github.com/Durairaj/infra.git//modules/gcp-cloud-run?ref=v0.6.0"

  project_id = var.project_id
  region     = var.region
  name       = "mahanthltd-web"
  image      = "${module.baseline.registry}/web:${var.image_tag}"
  port       = 3000

  env = merge({
    CONTACT_TO_EMAIL = "support@mahanthltd.co.uk"
  }, var.web_extra_env)

  # Values are added out of band, never through Terraform — see ../apply.sh.
  secrets = merge({
    RESEND_API_KEY = "mahanthltd-resend-api-key"
  }, var.web_extra_secrets)

  min_instances = 0

  depends_on = [module.baseline]
}

output "web_url" {
  value = module.web.url
}

output "web_secret_ids" {
  description = "Secret Manager containers the web service reads. Add versions to these out of band."
  value       = module.web.secret_ids
}

# ----------------------------------------------------------------- domain
#
# Cloud Run's own native domain mapping is region-gated and unsupported in
# many regions (see ordersmart-com's own infra/README.md for the full
# reasoning) — Firebase Hosting rewrites to Cloud Run in any region, is
# free, and brings a managed certificate and CDN with it, same reasoning as
# every sibling project.

module "hosting" {
  source = "git::ssh://git@github.com/Durairaj/infra.git//modules/gcp-firebase-hosting?ref=v0.6.0"

  providers = { google-beta = google-beta }

  project_id = var.project_id

  sites = {
    mahanthltd-web = {
      run_service = "mahanthltd-web"
      region      = var.region
      domains     = [var.domain, "www.${var.domain}"]
    }
  }

  depends_on = [module.web]
}

output "hosting_sites" {
  description = "Default *.web.app URL, useful for checking the site works before the domain resolves."
  value       = module.hosting.sites
}

output "required_dns_updates" {
  description = <<-DESC
    What the custom domain needs in DNS before Firebase will serve it and
    issue a certificate — add these at mahanthltd.co.uk's REAL authoritative
    DNS. Read this after the first apply of this module; the values are not
    known until the custom domain resource exists.
  DESC
  value       = module.hosting.required_dns_updates
}
