const { Sequelize, sequelize, Vehicle_Type } = require("../models");

class VehicleTypeController {
  create = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      // validate
      const validate = this.validate(req.body);
      if (!validate.status) {
        return res.status(400).send(`Error validation: ${validate.message}`);
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

        return res.status(400).send("Error: Vehicle Type existed.");
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

      return res.status(201).send("Vehicle Type created.");
    } catch (error) {
      await transaction.rollback();

      return res.status(500).send("Error: Failed to create Vehicle Type.");
    }
  };

  get = async (req, res) => {
    try {
      const vehicleTypes = await Vehicle_Type.findAll({});

      return res.status(200).send(vehicleTypes);
    } catch (error) {
      return res.status(500).send("Failed to retrieve vehicle types.");
    }
  };

  update = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      // Validate
      const validate = this.validate(req.body);
      if (!validate.status) {
        return res.status(400).send(`Error validation: ${validate.message}`);
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

        return res.status(400).send("Error: Vehicle Type existed.");
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
        return res.status(200).send("Vehicle Types successfully edited.");
      }

      return res.status(400).send("Error: Failed to update vehicle types.");
    } catch (error) {
      await transaction.rollback();
      return res.status(500).send("Error: Failed to update vehicle types.");
    }
  };

  delete = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
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
          return res.status(204).send("Vehicle Types successfully deleted.");
        }

        return res.status(404).send("No vehicles type found.");
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).send("Error: Failed to delete vehicle types.");
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
