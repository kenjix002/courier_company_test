FROM node:18.15.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g sequelize-cli
RUN npm i

RUN npm run migrate
RUN npm run seed

COPY . .

EXPOSE 8000

CMD ["npm","run","start"]