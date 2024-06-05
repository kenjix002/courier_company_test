const { Sequelize, sequelize, Maintenance_Type } = require("../models");

class MaintenanceTypeController {
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
      const exists = await Maintenance_Type.findOne(
        {
          where: {
            type: req.body.type,
          },
        },
        { transaction },
      );
      if (exists) {
        await transaction.commit();

        return res.status(400).json({ message: "maintenance type existed." });
      }

      // Create
      await Maintenance_Type.create(
        {
          type: req.body.type,
          priority: req.body.priority,
          periodic_maintenance_month: req.body.periodic_maintenance_month,
        },
        { transaction },
      );
      await transaction.commit();

      req.logger.info(`maintenance type created by ${authinfo.name}`);
      return res.status(201).json({ message: "maintenance type successfully created." });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`fail to create maintenance type by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to create maintenance type." });
    }
  };

  get = async (req, res) => {
    const authinfo = req.decoded;
    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

      // pagination
      let page = null;
      let limit = null;
      let offset = null;
      if (req.query.page) {
        page = req.query.page;
        limit = 5;
        offset = (page - 1) * limit;
      }

      const maintenanceType = await Maintenance_Type.findAndCountAll({ limit, offset });

      const pageinfo = {
        totalItems: maintenanceType.count,
        totalPages: Math.ceil(maintenanceType.count / limit),
        currentPage: page,
        maxItemPerPage: limit,
      };

      req.logger.info(`maintenance types retrieved by ${authinfo.name}`);
      return res.status(200).json({ data: maintenanceType.rows, pageinfo });
    } catch (error) {
      req.logger.error(`fail to retrieve maintenance types by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to retrieve maintenance types." });
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

        return res.status(400).json({ message: "maintenance type existed." });
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
        req.logger.info(`maintenance type updated by ${authinfo.name}`);
        return res.status(200).json({ message: "maintenance type successfully updated." });
      }

      req.logger.error(`fail to update maintenance type by ${authinfo.name}`);
      return res.status(400).json({ message: "failed to update maintenance type." });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`fail to update maintenance type by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to update maintenance type." });
    }
  };

  delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    const authinfo = req.decoded;

    try {
      if (authinfo.role !== "ADMIN") {
        return res.status(403).json({ message: "forbidden action." });
      }

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
          req.logger.info(`maintenance type deleted by ${authinfo.name}`);
          return res.status(204).json({ message: "maintenance type successfully deleted." });
        }

        req.logger.warn(`fail to delete maintenance type by ${authinfo.name}`);
        return res.status(404).json({ message: "no maintenance type found" });
      });
    } catch (error) {
      await transaction.rollback();
      req.logger.error(`fail to delete maintenance type by ${authinfo.name}`);
      return res.status(500).json({ message: "failed to delete maintenance type" });
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
      result.message = "periodic maintenance month cannot be lesser than 1 month";
      result.status = false;
    }

    return result;
  }
}

module.exports = new MaintenanceTypeController();
