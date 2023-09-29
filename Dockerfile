FROM node:16.14.2-alpine as build

WORKDIR /app

RUN apk update
RUN npm install -g pnpm@8.6.5 sass

COPY ["package.json", "package-lock.json*", "./"]

RUN pnpm install

COPY . /app

ARG branch
RUN rm .env && mv .env.$branch .env

RUN pnpm build

#######################

FROM nginx:stable-alpine

WORKDIR /app

COPY --from=build /app/dist /app
COPY --from=build /app/conf.d /etc/nginx/conf.d

