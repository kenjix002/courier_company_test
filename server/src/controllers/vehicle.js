const { Sequelize, sequelize, Vehicle } = require("../models");

class VehicleController {
  create = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      // validate
      const validate = this.validate(req.body);
      if (!validate.status) {
        return res.status(400).send(`Error validation: ${validate.message}`);
      }

      // check duplicate
      const exists = await Vehicle.findOne(
        {
          where: {
            user_id: req.body.user_id,
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).send("Error: User already had a vehicle");
      }

      // Create
      await Vehicle.create(
        {
          user_id: req.body.user_id,
          vehicle_type_id: req.body.vehicle_type_id,
          start_date: req.body.start_date,
        },
        { transaction },
      );

      // TODO
      // trigger vehicle-maintenance
      // default have 3

      await transaction.commit();

      return res.status(201).send("Vehicle created.");
    } catch (error) {
      await transaction.rollback();

      return res.status(500).send("Error: Failed to create Vehicle.");
    }
  };

  get = async (req, res) => {
    // If admin can see all, else can only see themselves

    // user id
    // user role

    try {
      const maintenanceType = await Maintenance_Type.findAll({});

      return res.status(200).send(maintenanceType);
    } catch (error) {
      return res.status(500).send("Failed to retrieve maintenance types.");
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
      const exists = await Maintenance_Type.findOne(
        {
          where: {
            type: req.body.type,
            id: { [Sequelize.Op.ne]: req.params.id },
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).send("Error: Maintenance Type existed.");
      }

      // Update
      const [updatedCount] = await Maintenance_Type.update(
        {
          type: req.body.type,
          priority: req.body.priority,
          periodic_maintenance_month: req.body.periodic_maintenance_month,
        },
        { where: { id: req.params.id } },
        { transaction },
      );
      await transaction.commit();

      if (updatedCount) {
        return res.status(200).send("Maintenance Types successfully edited.");
      }

      return res.status(400).send("Error: Failed to update maintenance types.");
    } catch (error) {
      await transaction.rollback();
      return res.status(500).send("Error: Failed to update maintenance types.");
    }
  };

  delete = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      await Maintenance_Type.destroy(
        {
          where: {
            id: req.params.id,
          },
        },
        { transaction },
      ).then(async (deletedCount) => {
        await transaction.commit();

        if (deletedCount) {
          return res
            .status(204)
            .send("Maintenance Types successfully deleted.");
        }

        return res.status(404).send("No maintenance type found.");
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).send("Error: Failed to delete maintenance types.");
    }
  };

  validate(req) {
    let result = {
      message: "",
      status: true,
    };

    if (req.type.trim() === "") {
      result.message = "type cannot be empty";
      result.status = false;
    }

    if (req.priority.trim() === "") {
      result.message = "priority cannot be empty";
      result.status = false;
    }

    if (req.periodic_maintenance_month < 1) {
      result.message =
        "periodic maintenance month cannot be lesser than 1 month";
      result.status = false;
    }

    return result;
  }
}

module.exports = new VehicleController();
