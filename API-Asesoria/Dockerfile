FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# HTTP Port
EXPOSE "3009:3009" 

ENTRYPOINT [ "node", "app.js" ]