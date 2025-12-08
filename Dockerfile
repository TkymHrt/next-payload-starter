FROM node:24.11.1-trixie-slim AS base

FROM base AS deps
WORKDIR /app

# RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

RUN echo 'const http = require("http"); \
const options = { \
  host: "localhost", \
  port: 3000, \
  path: "/api/health", \
  timeout: 2000 \
}; \
const request = http.request(options, (res) => { \
  console.log("STATUS: " + res.statusCode); \
  if (res.statusCode == 200) { \
    process.exit(0); \
  } else { \
    process.exit(1); \
  } \
}); \
request.on("error", (err) => { \
  console.log("ERROR: " + err.message); \
  process.exit(1); \
}); \
request.end();' > healthcheck.js

FROM gcr.io/distroless/nodejs24-debian13 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/media ./media

COPY --from=builder --chown=nonroot:nonroot /app/src/migrations ./src/migrations

COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

COPY --from=builder --chown=nonroot:nonroot /app/healthcheck.js ./

USER nonroot

EXPOSE 3000

CMD ["server.js"]