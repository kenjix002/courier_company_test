FROM node:18.15.0

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run start"]