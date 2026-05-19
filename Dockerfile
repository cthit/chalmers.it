##########################
#   DEPENDENCY STAGE     #
##########################
FROM node:26.1-alpine AS deps
LABEL maintainer="digIT <digit@chalmers.it>"

RUN apk add --no-cache libc6-compat && corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile

##########################
#      BUILD STAGE       #
##########################
FROM node:26.1-alpine AS builder

RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma generate
RUN pnpm build

##########################
#    PRODUCTION STAGE    #
##########################
FROM node:26.1-alpine AS runner

RUN apk add --no-cache openssl && corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV FORCE_COLOR=1
ENV MEDIA_PATH=/app/media

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p $MEDIA_PATH && \
    chown -R nextjs:nodejs $MEDIA_PATH

RUN pnpm add -g prisma@5.22.0

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
        CMD wget 127.0.0.1:3000/api/heartbeat -q -O - > /dev/null 2>&1

COPY --chown=nextjs:nodejs prisma ./prisma

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

SHELL ["/bin/sh", "-c"]
CMD prisma migrate deploy && node server.js
