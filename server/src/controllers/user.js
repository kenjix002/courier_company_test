const { Sequelize, sequelize, User, Auth } = require("../models");
const bcrypt = require("bcrypt");
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");

class UserController {
  create = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

      // validation
      const validate = this.validateCreate(req.body);
      if (!validate.status) {
        return res.status(400).json({ message: validate.message });
      }

      // Check duplicate
      const existAuth = await Auth.findOne({
        where: { username: req.body.username },
      });
      const existUser = await User.findOne({
        where: {
          [Sequelize.Op.or]: [{ email: req.body.email }, { name: req.body.name }],
        },
      });

      if (existAuth || existUser) {
        return res.status(400).json({ message: "user already existed." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create Auth
      const auth = await Auth.create({ username: req.body.username, password: hashed }, { transaction });

      // Create User
      await User.create(
        {
          name: req.body.name,
          role: req.body.role,
          email: req.body.email,
          client: req.body.client,
          auth_id: auth.id,
        },
        { transaction },
      );

      await await transaction.commit();

      req.logger.info(`created user ${req.body.name} by ${authinfo.name}`);
      return res.status(201).json({ message: "user successfully created." });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`failed to create user by ${authinfo.name}`);
      return res.status(400).json({ message: "failed to create user." });
    }
  };

  get = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    if (authinfo.role !== "ADMIN") {
      return res.status(403).json({ message: "forbidden action." });
    }

    try {
      const user = await User.findAll({}, { transaction });

      await transaction.commit();

      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ message: "failed to retrieve user." });
    }
  };

  validateCreate(req) {
    let result = {
      message: "",
      status: true,
    };

    if (req.username.trim() === "") {
      result.message = "username cannot be empty";
      result.status = false;
    }

    if (req.password.trim() === "") {
      result.message = "password cannot be empty";
      result.status = false;
    }

    if (req.name.trim() === "") {
      result.message = "name cannot be empty";
      result.status = false;
    }

    if (req.email.trim() === "") {
      result.message = "email cannot be empty";
      result.status = false;
    }

    if (req.role.trim() === "") {
      result.message = "role cannot be empty";
      result.status = false;
    }

    if (req.client.trim() === "") {
      result.message = "client cannot be empty";
      result.status = false;
    }

    return result;
  }

  login = async (req, res) => {
    const credential = basicAuth(req);

    const authUser = await Auth.findOne({
      where: { username: credential.name },
    });

    if (!authUser) {
      return res.status(401).json({ message: "wrong username/password." });
    }

    const isPassword = await bcrypt.compare(credential.pass, authUser.password);

    if (isPassword) {
      // Get user
      const user = await User.findOne({ where: { auth_id: authUser.id } });

      // Generate jwt
      const info = {
        user_id: user.id,
        name: user.name,
        role: user.role,
      };
      const jwtToken = jwt.sign(info, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      req.logger.info(`user ${user.name} logged in.`);
      return res.status(200).json({
        user_id: user.id,
        role: user.role,
        token: jwtToken,
      });
    }

    return res.status(401).json({ message: "wrong username/password." });
  };

  verifyToken = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "invalid token." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "invalid token." });
      }

      return res.status(200).json({ message: "verified." });
    });
  };
}

module.exports = new UserController();
