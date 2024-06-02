FROM node:18.15.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g sequelize-cli
RUN npm i

COPY . .

EXPOSE 8000

# migrate db, seed db, then start server
CMD ["sh", "-c", "sleep 30 && npm run migrate && npm run seed && npm run start"]