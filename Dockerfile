# Etapa 1: Construção da imagem
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
COPY .env.production .env   
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servindo os arquivos estáticos com NGINX
FROM nginx:alpine

# Corrigido: Vite gera /dist, não /build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
