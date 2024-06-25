FROM node:16-alpine as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm ci

RUN npm run build

# Serve Application using Nginx Server

FROM nginx:alpine

COPY --from=build /app/dist/imagej-angular/ /usr/share/nginx/html

EXPOSE 80