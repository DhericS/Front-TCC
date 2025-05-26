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

# Copia o build gerado pelo Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração customizada do NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta padrão
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
