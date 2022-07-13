FROM node:16.9.0-alpine

WORKDIR /app

COPY . .

# RUN npm install 

RUN npm install nodemon -g

EXPOSE 8081

CMD ["nodemon","index.js"]

