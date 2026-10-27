# syntax=docker/dockerfile:1
#
# Mahanth Ltd website — multi-stage Next.js build.
#
# Build context is the repository root (see docker-compose.yml), so paths
# are `web/...`.
#
# Unlike ordersmart's web image, there is no NEXT_PUBLIC_API_BASE to bake in
# at build time — this app has no separate backend. RESEND_API_KEY and
# CONTACT_TO_EMAIL are read server-side (in app/api/contact/route.ts) at
# request time, so they're ordinary Cloud Run env/secret values, not build
# args.

# ------------------------------------------------------------ dependencies
FROM node:22-trixie-slim AS deps
WORKDIR /app
COPY web/package.json web/package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# -------------------------------------------------------------------- dev
FROM node:22-trixie-slim AS dev
WORKDIR /app
ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
# --webpack, not the default Turbopack: a macOS bind mount delivers no
# filesystem events into the container, so the watcher has to poll.
CMD ["npx", "next", "dev", "--webpack", "-H", "0.0.0.0", "-p", "3000"]

# ------------------------------------------------------------------ build
FROM node:22-trixie-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY web/ ./
RUN npm run build

# ----------------------------------------------------------------- runtime
FROM node:22-trixie-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN groupadd --system --gid 10003 website \
 && useradd  --system --uid 10003 --gid website --no-create-home --shell /usr/sbin/nologin website

# Next's standalone output (`output: "standalone"` in web/next.config.ts).
COPY --from=builder --chown=website:website /app/.next/standalone ./
COPY --from=builder --chown=website:website /app/.next/static ./.next/static
COPY --from=builder --chown=website:website /app/public ./public

USER website:website

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
