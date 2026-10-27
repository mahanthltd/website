#!/usr/bin/env bash
#
# First apply for a project whose secret is not yet in Secret Manager.
# Shorter than ordersmart's/tirupurhub's own apply.sh: this project has
# only one Cloud Run service and no NEXT_PUBLIC_* baked at build time, so
# there's no circular dependency to stage around — just secret-before-apply.
#
# Four stages, in order:
#
#   1. baseline (registry, budget, APIs) + the web service's secret
#      container only
#   2. the secret value, read from the terminal and piped straight to gcloud
#   3. build + push the web image
#   4. apply everything — this is what makes the service exist and the
#      domain mapping real
#
# Safe to re-run. Each stage is a no-op (or near enough) once its own part
# is already done.
#
# Usage:  ./apply.sh            review each plan and confirm
#         ./apply.sh --yes      no prompts on the applies, for a re-run you have already read

set -euo pipefail

PROJECT="${PROJECT:-}"
REGION="${REGION:-europe-west2}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LIVE_DIR="$REPO_ROOT/infra/live"
IMAGE_TAG="${IMAGE_TAG:-latest}"

AUTO_APPROVE=""
[[ "${1:-}" == "--yes" ]] && AUTO_APPROVE="-auto-approve"

say()  { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
die()  { printf '\n\033[31merror: %s\033[0m\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------- preflight

command -v tofu   >/dev/null || die "tofu not found. brew install opentofu"
command -v gcloud >/dev/null || die "gcloud not found"
command -v docker >/dev/null || die "docker not found"

if [[ -z "$PROJECT" && -f "$LIVE_DIR/terraform.tfvars" ]]; then
  PROJECT="$(sed -n 's/^[[:space:]]*project_id[[:space:]]*=[[:space:]]*"\([^"]*\)".*/\1/p' \
    "$LIVE_DIR/terraform.tfvars" | head -1)"
fi
[[ -n "$PROJECT" ]] || die \
  "no project id. Set project_id in live/terraform.tfvars, or run: PROJECT=<id> ./apply.sh"

ACTIVE_PROJECT="$(gcloud config get-value project 2>/dev/null || true)"
[[ "$ACTIVE_PROJECT" == "$PROJECT" ]] || die \
  "gcloud is pointed at '${ACTIVE_PROJECT:-nothing}', not '$PROJECT'. Run: gcloud config set project $PROJECT"

gcloud auth application-default print-access-token >/dev/null 2>&1 || die \
  "no Application Default Credentials.
   Run: gcloud auth application-default login && gcloud auth application-default set-quota-project $PROJECT"

cd "$LIVE_DIR"
[[ -d .terraform ]] || die "run 'tofu init -backend-config=\"bucket=tfstate-$PROJECT\"' here first"

BUILD_PLATFORM="${BUILD_PLATFORM:-linux/amd64}"  # Cloud Run's safest target; override if building on an amd64 host already

# --------------------------------------------- 1. baseline + secret container

say "1/4  Baseline (registry, budget, APIs) + the web service's secret container"
tofu apply $AUTO_APPROVE \
  -target='module.baseline' \
  -target='module.web.google_secret_manager_secret.this'

REGISTRY="$(tofu output -raw registry)"
gcloud auth configure-docker "${REGISTRY%%/*}" --quiet >/dev/null

# ------------------------------------------------------------ 2. the value

say "2/4  Adding the secret value"

if gcloud secrets versions list "mahanthltd-resend-api-key" --project="$PROJECT" --limit=1 \
     --format='value(name)' 2>/dev/null | grep -q .; then
  printf '  %-28s already has a version, leaving it\n' "mahanthltd-resend-api-key"
else
  printf '  RESEND_API_KEY — from resend.com, used to send contact-form submissions.\n'
  read -rs -p "    value (not echoed): " RESEND_VALUE </dev/tty
  printf '\n'
  [[ -n "$RESEND_VALUE" ]] || die "mahanthltd-resend-api-key needs a value"
  printf '%s' "$RESEND_VALUE" | gcloud secrets versions add "mahanthltd-resend-api-key" \
    --project="$PROJECT" --data-file=- >/dev/null
  unset RESEND_VALUE
  printf '  %-28s version added\n' "mahanthltd-resend-api-key"
fi

# --------------------------------------------------- 3. build + push the image

say "3/4  Building and pushing the web image"
docker buildx build --platform "$BUILD_PLATFORM" \
  -f "$REPO_ROOT/docker/web.Dockerfile" -t "$REGISTRY/web:$IMAGE_TAG" --push "$REPO_ROOT"

# ----------------------------------------------------------------- 4. apply

say "4/4  Applying everything else (web service, domain mapping, github_deploy, outputs)"
tofu apply $AUTO_APPROVE

# ---------------------------------------------------------------- handover

say "Done"
cat <<EOF

Reachable right now at its own *.run.app URL:
  web: $(tofu output -raw web_url 2>/dev/null || echo '<not in state yet>')

DNS records needed for mahanthltd.co.uk — read in full with:
  tofu output -json required_dns_updates

EOF
