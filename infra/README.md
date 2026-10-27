# Infrastructure

Mahanth Ltd's own GCP project — `mahanthltd-prod` — entirely separate from
every product project (ordersmart-prod, tirupurhub-prod, etc.). Adapted
from `ordersmart/infra/`, same module library, same shape, retargeted; read
that project's own `infra/README.md` for the fuller reasoning behind each
module choice (why Cloud Run rather than Render or AWS, why no secret value
ever passes through Terraform). This file covers only what's different
here.

```
bootstrap/   the state bucket. Run once, ever, and it keeps local state.
live/        the project: baseline, one Cloud Run service, CI identity.
apply.sh     the staged first apply — much shorter than the product
             projects' own, since there's no circular dependency here
             (see apply.sh's own header for why).
```

No `module.dns`, no second Cloud Run service, no database — this is a
marketing site with one server-rendered form, not a product.

## Decisions this project already made (don't re-litigate these)

**Project id: `mahanthltd-prod`. Region: `europe-west2` (London).** Unlike
the India-facing product projects (`asia-south1`), this is the company's
own UK-facing site — London is the right home region. Billing account
`01D020-F10975-4645D1` (GBP) — the same one every other project uses.

**Budget: £1/month, an alert not a cap.** The web service runs at
`min_instances = 0` (true scale-to-zero), so idle cost should be near zero;
£1 is tuned to catch the first sign of anything unexpected.

**Domain: `mahanthltd.co.uk`, registered by the project owner directly, not
through Cloud Domains.** Same Firebase Hosting + Cloud Run rewrite pattern
as every sibling project, for the same reason: Cloud Run's own domain
mapping is region-gated, Firebase Hosting isn't, and it's free.

**No separate API service.** The contact form is a single Next.js Route
Handler (`web/app/api/contact/route.ts`) inside the same app, emailing via
Resend. This is why there's no `module.api`, no MongoDB, no
`api_extra_secrets`-style circular dependency to stage around in
`apply.sh` — just one secret (`RESEND_API_KEY`) that needs a version before
the one Cloud Run revision will start.

## First apply

```
cd infra/bootstrap && tofu init && tofu apply
cd ../live
tofu init -backend-config="bucket=$(cd ../bootstrap && tofu output -raw state_bucket)"
cp terraform.tfvars.example terraform.tfvars   # fill in billing_account
../apply.sh
```

After the first apply, read `tofu output -json required_dns_updates` and
add those records at mahanthltd.co.uk's real DNS — a separate, later,
explicitly-confirmed step, same as every sibling project.
