const { Sequelize, sequelize, Vehicle, User, Vehicle_Type, Vehicle_Maintenance } = require("../models");

const sortField = ["registry", "name", "client", "brand", "model", "type"];

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
            [Sequelize.Op.or]: [{ user_id: req.body.user_id }, { registry: req.body.registry }],
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).json({ message: "user already had a vehicle. / Registry existed." });
      }

      // Check availability
      const availability = await Vehicle_Type.findOne(
        {
          where: {
            id: req.body.vehicle_type_id,
          },
        },
        { transaction },
      );
      if (!availability.availability) {
        await transaction.commit();

        return res.status(400).json({ message: "vehicle not available." });
      }

      // Create
      const created = await Vehicle.create(
        {
          user_id: req.body.user_id,
          vehicle_type_id: req.body.vehicle_type_id,
          registry: req.body.registry,
          start_date: new Date(),
        },
        { transaction },
      );

      await transaction.commit();

      req.logger.info(`created new vehicle by ${authinfo.name}`);
      return res.status(201).json({ id: created.id, message: "vehicle successfully created." });
    } catch (error) {
      await transaction.rollback();

      req.logger.error(`fail to create new vehicle by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to create vehicle." });
    }
  };

  get = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    try {
      // pagination
      let page = null;
      let limit = null;
      let offset = null;
      if (req.query.page) {
        page = req.query.page;
        limit = 5;
        offset = (page - 1) * limit;
      }

      // sorting and ordering
      let sortBy = "name";
      let order = "ASC";
      if (req.query.sortBy) {
        sortBy = req.query.sortBy;
      }
      if (req.query.order) {
        order = req.query.order;
      }

      const filter = {
        include: [{ model: User }, { model: Vehicle_Type }],
        order: [[{ User, Vehicle_Type }, sortBy, order]],
        limit,
        offset,
        transaction,
      };
      if (authinfo.role !== "ADMIN") {
        filter.where = { user_id: authinfo.user_id };
      }

      const vehicles = await Vehicle.findAndCountAll(filter);
      await transaction.commit();

      const pageinfo = {
        totalItems: vehicles.count,
        totalPages: Math.ceil(vehicles.count / limit),
        currentPage: page,
        maxItemPerPage: limit,
      };

      let vehicleInfo = [];
      for (const vehicle of vehicles.rows) {
        const user = await User.findOne({ where: { id: vehicle.user_id } });
        const vehicleType = await Vehicle_Type.findOne({ where: { id: vehicle.vehicle_type_id } });
        vehicleInfo.push({ id: vehicle.id, user, vehicleType, registry: vehicle.registry });
      }

      req.logger.info(`vehicles info retrieved by ${authinfo.name}`);
      return res.status(200).json({ data: vehicleInfo, pageinfo, sortField });
    } catch (error) {
      req.logger.error(`fail to retrieve vehicles info by ${authinfo.name}`);
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
          registry: req.body.registry,
          start_date: req.body.datetime,
        },
        { where: { id: req.params.id } },
        { transaction },
      );
      await transaction.commit();

      if (updatedCount) {
        req.logger.info(`vehicle info updated by ${authinfo.name}`);
        return res.status(200).json({ message: "vehicle successfully edited." });
      }

      req.logger.error(`fail to update vehicle info by ${authinfo.name}`);
      return res.status(400).json({ message: "Failed to update vehicle." });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`fail to update vehicle info by ${authinfo.name}`);
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

      await Vehicle_Maintenance.destroy({
        where: {
          vehicle_id: req.params.id,
        },
      });

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
          req.logger.info(`vehicle info deleted by ${authinfo.name}`);
          return res.status(204).json({ message: "vehicle successfully deleted." });
        }

        req.logger.warn(`fail to delete vehicle info by ${authinfo.name}`);
        return res.status(404).json({ message: "no vehicle found." });
      });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`fail to delete vehicle info by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to delete vehicle." });
    }
  };

  validate(req) {
    let result = {
      message: "",
      status: true,
    };

    if (typeof req.user_id !== "number" || req.user_id === 0) {
      result.status = false;
      result.message = "invalid user.";
    }

    if (typeof req.vehicle_type_id !== "number" || req.vehicle_type_id === 0) {
      result.status = false;
      result.message = "invalid vehicle type.";
    }

    if (req.registry.trim() === "") {
      result.status = false;
      result.message = "vehicle registry cannot be empty.";
    }

    return result;
  }
}

module.exports = new VehicleController();
