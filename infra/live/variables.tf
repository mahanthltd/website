variable "project_id" {
  description = "The GCP project id."
  type        = string
  default     = "mahanthltd-prod"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "project_id must be 6-30 characters of lowercase letters, digits and hyphens, starting with a letter."
  }
}

variable "region" {
  description = "Home region. europe-west2 is London — the right choice for a UK Ltd company's own site, unlike the India-facing sibling projects (asia-south1)."
  type        = string
  default     = "europe-west2"
}

variable "billing_account" {
  description = "Billing account id the budget is created on, e.g. 0000AA-1111BB-2222CC."
  type        = string
}

variable "monthly_budget" {
  description = <<-DESC
    Monthly budget, a whole number in the BILLING ACCOUNT'S OWN CURRENCY
    (GBP here) — not USD. This is an alert threshold, not a spending cap.
    Set low (1) on purpose — the single Cloud Run service runs at
    `min_instances = 0` (true scale-to-zero), so this is a smoke alarm
    tuned to go off at the first sign of anything unexpected.
  DESC
  type        = number
  default     = 1
}

variable "github_repository" {
  description = <<-DESC
    The repository permitted to deploy into this project, "owner/name",
    spelled exactly as GitHub does.
  DESC
  type        = string
  default     = "mahanthltd/website"
}

variable "domain" {
  description = "Apex domain, without a trailing dot."
  type        = string
  default     = "mahanthltd.co.uk"
}

variable "image_tag" {
  description = <<-DESC
    The tag the web service is deployed at, in the Artifact Registry
    repository the baseline creates. The first apply needs an image at
    this tag to already exist — see ../apply.sh.
  DESC
  type        = string
  default     = "latest"
}

variable "web_extra_secrets" {
  description = "Further Secret Manager containers to create and expose on the web service, as environment variable name -> secret id. Empty by default."
  type        = map(string)
  default     = {}
}

variable "web_extra_env" {
  description = "Further plain environment variables on the web service, merged over the ones set in main.tf. Not for secrets — use web_extra_secrets instead."
  type        = map(string)
  default     = {}
}
