const { Sequelize, sequelize, Vehicle_Type } = require("../models");

class VehicleTypeController {
  create = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

      // validate
      const validate = this.validate(req.body);
      if (!validate.status) {
        return res.status(400).json({ message: validate.message });
      }

      // check duplicate
      const exists = await Vehicle_Type.findOne(
        {
          where: {
            brand: req.body.brand,
            model: req.body.model,
            type: req.body.type,
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).json({ message: "vehicle type existed." });
      }

      // Create
      await Vehicle_Type.create(
        {
          brand: req.body.brand,
          model: req.body.model,
          type: req.body.type,
          availability: true,
        },
        { transaction },
      );

      await transaction.commit();

      return res.status(201).json({ message: "vehicle type successfully created." });
    } catch (error) {
      await transaction.rollback();

      return res.status(500).json({ message: "failed to create vehicle type." });
    }
  };

  get = async (req, res) => {
    const authinfo = req.decoded;

    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

      const vehicleTypes = await Vehicle_Type.findAll({});

      return res.status(200).json({ data: vehicleTypes });
    } catch (error) {
      return res.status(500).json({ message: "failed to retrive vehicle types." });
    }
  };

  update = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

      // Validate
      const validate = this.validate(req.body);
      if (!validate.status) {
        return res.status(400).json({ message: validate.message });
      }

      // Check duplicate
      const exists = await Vehicle_Type.findOne(
        {
          where: {
            brand: req.body.brand,
            model: req.body.model,
            type: req.body.type,
            id: { [Sequelize.Op.ne]: req.params.id },
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).json({ message: "vehicle type existed." });
      }

      // Update
      const [updatedCount] = await Vehicle_Type.update(
        {
          brand: req.body.brand,
          model: req.body.model,
          type: req.body.type,
          availability: req.body.availability,
        },
        { where: { id: req.params.id } },
        { transaction },
      );
      await transaction.commit();

      if (updatedCount) {
        return res.status(200).json({ message: "vehicle type successfully created." });
      }

      return res.status(400).json({ message: "failed to update vehicle type." });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({ message: "failed to update vehicle type." });
    }
  };

  delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

      await Vehicle_Type.destroy(
        {
          where: {
            id: req.params.id,
          },
        },
        { transaction },
      ).then(async (deletedCount) => {
        await transaction.commit();

        if (deletedCount) {
          return res.status(204).json();
        }

        return res.status(404).json({ message: "no vehicle type found." });
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({ message: "failed to delete vehicle type." });
    }
  };

  validate(req) {
    let result = {
      message: "",
      status: true,
    };

    if (req.brand.trim() === "") {
      result.message = "brand cannot be empty";
      result.status = false;
    }

    if (req.model.trim() === "") {
      result.message = "brand cannot be empty";
      result.status = false;
    }

    if (req.type.trim() === "") {
      result.message = "brand cannot be empty";
      result.status = false;
    }

    return result;
  }
}

module.exports = new VehicleTypeController();
