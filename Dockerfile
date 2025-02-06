# Etapa 1: Construcción de la aplicación Angular
FROM node:18.10.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g @angular/cli@16
COPY . .

# Etapa 2: Servir la aplicación con ng serve
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]
