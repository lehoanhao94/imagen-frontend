ARG NODE_VERSION=20.16.0
ARG CLOUDFLARE_ACCOUNT_ID=1234567890
ARG CLOUDFLARE_API_TOKEN=secret-api-token

FROM node:${NODE_VERSION}-slim AS base

ARG PORT=3000

WORKDIR /src

# Build
FROM base AS build

RUN npm install -g pnpm wrangler
COPY --link package.json pnpm-lock.yaml ./
COPY .npmrc ./

RUN pnpm install

COPY --link . .

ENV NODE_OPTIONS=--max-old-space-size=7168

RUN pnpm run generate

# Run
FROM base

ENV PORT=$PORT
ENV NODE_ENV=production

RUN npm install -g wrangler

COPY --from=build /src/.output ./