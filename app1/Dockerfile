FROM node:16.9.0-alpine

WORKDIR /app

COPY . .

RUN npm install nodemon -g

EXPOSE 8080

CMD [ "nodemon","index.js" ]