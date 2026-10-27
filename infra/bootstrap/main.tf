# The state bucket, and nothing else.
#
# This configuration keeps LOCAL state on purpose: the bucket that holds
# every other state file cannot store its own before it exists. Run it
# once, ever.
#
#   cd infra/bootstrap && tofu init && tofu apply
#
# If the local state is lost, import the bucket again — nothing here holds
# data of its own.

terraform {
  required_version = ">= 1.8"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
  # No backend block, deliberately. See above.
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {
  type    = string
  default = "mahanthltd-prod"
}

variable "region" {
  type    = string
  default = "europe-west2"
}

module "state" {
  source = "git::ssh://git@github.com/Durairaj/infra.git//modules/gcp-tfstate-bucket?ref=v0.3.3"

  project_id = var.project_id
  region     = var.region
}

output "state_bucket" {
  description = "Pass to `tofu init -backend-config=\"bucket=...\"` in infra/live."
  value       = module.state.name
}
