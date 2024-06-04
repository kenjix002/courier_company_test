const { Sequelize, sequelize, Maintenance_Type, Vehicle_Maintenance } = require("../models");

class VehicleMaintenanceController {
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
      const exists = await Vehicle_Maintenance.findOne(
        {
          where: {
            maintenance_type_id: req.body.maintenance_type_id,
            vehicle_id: req.body.vehicle_id,
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).json({ message: "vehicle maintenance detail existed." });
      }

      // Create
      const maintenanceType = await Maintenance_Type.findOne({ where: { id: req.body.maintenance_type_id } });
      const due = new Date();
      due.setMonth(due.getMonth() + maintenanceType.periodic_maintenance_month);

      await Vehicle_Maintenance.create(
        {
          maintenance_type_id: req.body.maintenance_type_id,
          vehicle_id: req.body.vehicle_id,
          due_schedule: due,
        },
        { transaction },
      );
      await transaction.commit();

      req.logger.info(`vehicle maintenance detail created by ${authinfo.name}`);
      return res.status(201).json({ message: "vehicle maintenance detail successfully created." });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`fail to create vehicle maintenance detail by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to create vehicle maintenance detail." });
    }
  };

  get = async (req, res) => {
    const authinfo = req.decoded;

    try {
      const vehicleMaintenance = await Vehicle_Maintenance.findAll({ where: { vehicle_id: req.params.vehicle_id } });

      req.logger.info(`vehicle maintenance details retrieved by ${authinfo.name}`);
      return res.status(200).json({ data: vehicleMaintenance });
    } catch (error) {
      req.logger.error(`fail to retrieve vehicle maintenance details by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to retrieve vehicle maintenance details." });
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
      const exists = await Vehicle_Maintenance.findOne(
        {
          where: {
            maintenance_type_id: req.body.maintenance_type_id,
            vehicle_id: req.body.vehicle_id,
            id: { [Sequelize.Op.ne]: req.params.id },
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).json({ message: "vehicle maintenance detail existed." });
      }

      // Update
      const maintenanceType = await Maintenance_Type.findOne({ where: { id: req.body.maintenance_type_id } });
      const due = new Date();
      due.setMonth(due.getMonth() + maintenanceType.periodic_maintenance_month);

      const [updatedCount] = await Vehicle_Maintenance.update(
        {
          maintenance_type_id: req.body.maintenance_type_id,
          vehicle_id: req.body.vehicle_id,
          due_schedule: due,
        },
        { where: { id: req.params.id } },
        { transaction },
      );
      await transaction.commit();

      if (updatedCount) {
        req.logger.info(`vehicle maintenance detail updated by ${authinfo.name}`);
        return res.status(200).json({ message: "vehicle maintenance detail successfully updated." });
      }

      req.logger.error(`fail to update vehicle maintenance by ${authinfo.name}`);
      return res.status(400).json({ message: "failed to update vehicle maintenance detail." });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`fail to update vehicle maintenance by ${authinfo.name}`);
      return res.status(400).json({ message: "failed to update vehicle maintenance detail." });
    }
  };

  delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

      await Vehicle_Maintenance.destroy(
        {
          where: {
            id: req.params.id,
          },
        },
        { transaction },
      ).then(async (deletedCount) => {
        await transaction.commit();

        if (deletedCount) {
          req.logger.info(`vehicle maintenance deleted by ${authinfo.name}`);
          return res.status(204).json({ message: "vehicle maintenance detail successfully deleted." });
        }

        req.logger.warn(`fail to delete vehicle maintenance by ${authinfo.name}`);
        return res.status(404).json({ message: "no vehicle maintenance detail found" });
      });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`fail to delete vehicle maintenance by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to delete vehicle maintenance detail" });
    }
  };

  validate(req) {
    let result = {
      message: "",
      status: true,
    };

    if (typeof req.vehicle_id !== "number") {
      result.status = false;
      result.message = "invalid vehicle.";
    }

    if (typeof req.maintenance_type_id !== "number") {
      result.status = false;
      result.message = "invalid maintenance type.";
    }

    return result;
  }
}

module.exports = new VehicleMaintenanceController();
