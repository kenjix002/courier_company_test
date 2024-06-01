const { Sequelize, sequelize, User, Auth } = require("../models");
const bcrypt = require("bcrypt");

class UserController {
  create = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      // validation
      const validate = this.validateCreate(req.body);
      if (!validate.status) {
        return res.status(400).send(`Error validation: ${validate.message}`);
      }

      // Check duplicate
      const existAuth = await Auth.findOne({
        where: { username: req.body.username },
      });
      const existUser = await User.findOne({
        where: {
          [Sequelize.Op.or]: [
            { email: req.body.email },
            { name: req.body.name },
          ],
        },
      });

      if (existAuth || existUser) {
        return res.status(400).send("Error: User already existed.");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create Auth
      const auth = await Auth.create(
        { username: req.body.username, password: hashed },
        { transaction },
      );

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
      return res.status(201).send("User created.");
    } catch (error) {
      await transaction.rollback();
      return res.status(400).send("Error: Failed to create user.");
    }
  };

  get = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const user = await User.findOne(
        {
          where: {
            auth_id: req.params.auth_id,
          },
        },
        { transaction },
      );

      await transaction.commit();

      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send(`Error: Failed to retrieve user.`);
    }
  };

  update(req, res) {
    res.send("unimplemented method");
  }

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
}

module.exports = new UserController();
