FROM node:lts-alpine AS build

WORKDIR /app

COPY .npmrc ./
COPY package*.json ./
COPY pnpm*.yaml ./

RUN corepack enable
RUN corepack prepare pnpm@9.12.2 --activate
RUN pnpm install --frozen-lockfile

COPY . .

ENV SVELTEKIT_ADAPTER=node

RUN pnpm run build

# Keep runtime image smaller.
RUN pnpm prune --prod --ignore-scripts

FROM node:lts-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY server.mjs ./server.mjs

EXPOSE 3000

CMD ["node", "server.mjs"]
