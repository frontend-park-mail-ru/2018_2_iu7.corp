FROM node:11.4.0 as base
WORKDIR /tmp
COPY . .
RUN npm install && npm run build

FROM nginx:1.15.7
COPY --from=base /tmp/nginx.conf /etc/nginx/nginx.conf
COPY --from=base /tmp/dist /var/www