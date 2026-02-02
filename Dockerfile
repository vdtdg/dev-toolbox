FROM node:lts-alpine AS build

WORKDIR /app

COPY .npmrc ./
COPY package*.json ./
COPY pnpm*.yaml ./

RUN corepack enable
RUN corepack prepare pnpm@9.12.2 --activate
RUN pnpm install --frozen-lockfile

COPY . .

ARG BASE_PATH
ENV BASE_PATH=${BASE_PATH}

RUN pnpm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
