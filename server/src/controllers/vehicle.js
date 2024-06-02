const { Sequelize, sequelize, Vehicle, User, Vehicle_Type } = require("../models");

class VehicleController {
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

        return res.status(400).json({ message: "user already had a vehicle" });
      }

      // Create
      await Vehicle.create(
        {
          user_id: req.body.user_id,
          vehicle_type_id: req.body.vehicle_type_id,
          start_date: new Date(),
        },
        { transaction },
      );

      await transaction.commit();

      return res.status(201).json({ message: "vehicle successfully created." });
    } catch (error) {
      await transaction.rollback();

      return res.status(500).json({ message: "failed to create vehicle." });
    }
  };

  get = async (req, res) => {
    const authinfo = req.decoded;

    try {
      const filter = authinfo.role !== "ADMIN" ? { where: { user_id: authinfo.user_id } } : {};
      const vehicles = await Vehicle.findAll(filter);

      let vehicleInfo = [];
      for (const vehicle of vehicles) {
        const user = await User.findOne({ where: { id: vehicle.user_id } });
        const vehicleType = await Vehicle_Type.findOne({ where: { id: vehicle.vehicle_type_id } });
        vehicleInfo.push({ user, vehicleType });
      }

      return res.status(200).json({ data: vehicleInfo });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "failed to retrieve vehicles." });
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
      const exists = await Vehicle.findOne(
        {
          where: {
            user_id: req.body.user_id,
            id: { [Sequelize.Op.ne]: req.params.id },
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).json({ message: "User already had another vehicle." });
      }

      // Update
      const [updatedCount] = await Vehicle.update(
        {
          user_id: req.body.user_id,
          vehicle_type_id: req.body.vehicle_type_id,
          start_date: new Date(),
        },
        { where: { id: req.params.id } },
        { transaction },
      );
      await transaction.commit();

      if (updatedCount) {
        return res.status(200).json({ message: "vehicle successfully edited." });
      }

      return res.status(400).json({ message: "Failed to update vehicle." });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({ message: "Failed to update vehicle." });
    }
  };

  delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

      await Vehicle.destroy(
        {
          where: {
            id: req.params.id,
          },
        },
        { transaction },
      ).then(async (deletedCount) => {
        await transaction.commit();

        if (deletedCount) {
          return res.status(204).json({ message: "vehicle successfully deleted." });
        }

        return res.status(404).json({ message: "no vehicle found." });
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({ message: "failed to delete vehicle." });
    }
  };

  validate(req) {
    let result = {
      message: "",
      status: true,
    };

    if (typeof req.user_id !== "number") {
      result.status = false;
      result.message = "invalid user.";
    }

    if (typeof req.vehicle_type_id !== "number") {
      result.status = false;
      result.message = "invalid vehicle type.";
    }

    return result;
  }
}

module.exports = new VehicleController();
