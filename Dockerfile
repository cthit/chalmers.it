FROM node:24.20.0-alpine AS deps
LABEL maintainer="digIT <digit@chalmers.it>"

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@12.3.4

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* pnpm-workspace.yaml ./
RUN pnpm i --frozen-lockfile

##########################
#      BUILD STAGE       #
##########################
FROM node:24.20.0-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ./node_modules/.bin/prisma generate
RUN npm run build

##########################
#    PRODUCTION STAGE    #
##########################
FROM node:24.20.0-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV FORCE_COLOR=1
ENV MEDIA_PATH=/app/media

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN npm install --prefix /opt/prisma prisma@7.10.0 dotenv@17.4.2

# Create media directory
RUN mkdir -p $MEDIA_PATH
RUN chown -R nextjs:nodejs $MEDIA_PATH

HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
        CMD wget 127.0.0.1:3000/api/heartbeat -q -O - > /dev/null 2>&1

# Copy database schema
COPY --chown=nextjs:nodejs prisma /opt/prisma/prisma
COPY --chown=nextjs:nodejs prisma.config.ts /opt/prisma/prisma.config.ts

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

SHELL ["/bin/sh", "-c"]
CMD /opt/prisma/node_modules/.bin/prisma migrate deploy --config /opt/prisma/prisma.config.ts && node server.js
