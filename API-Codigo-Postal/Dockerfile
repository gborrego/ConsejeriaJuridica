FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# HTTP Port
EXPOSE "3012:3012" 

ENTRYPOINT [ "node", "app.js" ]