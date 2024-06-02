const express = require("express");
const { Sequelize } = require("sequelize");
const routes = require("./src/routes/routes");
require("dotenv").config();
const cors = require("cors");
const winston = require("winston");

// Initialize Sequelize with your database configuration
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_DB_HOST,
  port: process.env.MYSQL_PORT_ACCESS,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

const app = express();
const port = process.env.SERVER_PORT;
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.logger = logger;
  return next();
});
app.use("/", routes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
