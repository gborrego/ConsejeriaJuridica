FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# HTTP Port
EXPOSE "3026:3026" 

ENTRYPOINT [ "node", "app.js" ]