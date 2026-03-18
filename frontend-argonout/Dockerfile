# Etap 1: Budowanie (Node)
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etap 2: Serwowanie (Nginx)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Opcjonalnie: skopiuj własną konfigurację nginx, aby obsłużyć routing (np. React Router)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
