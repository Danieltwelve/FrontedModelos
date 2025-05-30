FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

RUN ls -l /app/dist/login_detect/browser
RUN cat /app/dist/login_detect/browser/index.csr.html | head -n 20

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/login_detect/browser /usr/share/nginx/html

# Renombra index.csr.html a index.html para que NGINX lo sirva
RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]