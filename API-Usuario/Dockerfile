FROM node:24.11.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# HTTP Port
EXPOSE 3002

ENTRYPOINT [ "node", "app.js" ]