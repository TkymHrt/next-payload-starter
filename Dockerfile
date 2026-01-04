FROM node:24.11.1-trixie-slim AS node-base

FROM node-base AS base

RUN apt-get update && apt-get install -y --no-install-recommends curl unzip ca-certificates && curl -fsSL https://bun.sh/install | bash && apt-get purge -y --auto-remove curl unzip && rm -rf /var/lib/apt/lists/*
ENV PATH="/root/.bun/bin:${PATH}"

FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM node-base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/media ./media
COPY --from=builder --chown=nextjs:nodejs /app/src/migrations ./src/migrations

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]