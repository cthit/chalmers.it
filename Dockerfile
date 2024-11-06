FROM node:20.8.0-alpine AS deps
LABEL maintainer="digIT <digit@chalmers.it>"

RUN apk add --no-cache libc6-compat
RUN yarn global add pnpm

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

##########################
#      BUILD STAGE       #
##########################
FROM node:20.8.0-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn prisma generate
RUN yarn build

##########################
#    PRODUCTION STAGE    #
##########################
FROM node:20.8.0-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV FORCE_COLOR=1
ENV MEDIA_PATH=/app/media

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN yarn global add prisma@5.21.1

# Create media directory
RUN mkdir -p $MEDIA_PATH
RUN chown -R nextjs:nodejs $MEDIA_PATH

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
        CMD wget 127.0.0.1:3000/api/heartbeat -q -O - > /dev/null 2>&1

# Copy logger configs
COPY --chown=nextjs:nodejs next-logger.config.js /app/
COPY --chown=nextjs:nodejs pino-pretty-transport.js /app/

# Copy database schema
COPY --chown=nextjs:nodejs prisma ./prisma

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

SHELL ["/bin/sh", "-c"]
CMD npx prisma migrate deploy && node server.js
