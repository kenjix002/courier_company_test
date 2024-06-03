FROM node:18.15.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g sequelize-cli
RUN npm i

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]