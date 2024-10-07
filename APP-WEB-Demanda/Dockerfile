
# Usa una imagen oficial de Node.js para construir los archivos estáticos
FROM node:latest AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN rm -rf node_modules && npm install

# Copia el código fuente de la aplicación al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Usa una imagen oficial de Nginx para servir la aplicación
FROM nginx:latest

# Copia el archivo de configuración personalizado de Nginx al contenedor
COPY nginx.conf /etc/nginx/nginx.conf

# Copia los archivos estáticos generados al directorio html de Nginx
COPY --from=build /app/dist /usr/share/nginx/html_Demanda

# Expone los puertos definidos en tu configuración
EXPOSE 3030

# Inicia Nginx cuando se lance el contenedor
CMD ["nginx", "-g", "daemon off;"]