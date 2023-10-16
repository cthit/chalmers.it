FROM node:20.8.0-alpine AS deps
LABEL maintainer="digIT <digit@chalmers.it>"

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn global add pnpm && pnpm i --frozen-lockfile

FROM node:20.8.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:20.8.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs next-logger.config.js /app/
COPY --chown=nextjs:nodejs pino-pretty-transport.js /app/
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
