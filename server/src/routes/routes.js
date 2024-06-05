const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const user = require("../controllers/user");
const vehicleType = require("../controllers/vehicle-type");
const maintenanceType = require("../controllers/maintenance-type");
const vehicle = require("../controllers/vehicle");
const vehicleMaintenance = require("../controllers/vehicle-maintenance");

// User
router.get("/users", authMiddleware, user.get);
router.post("/users", authMiddleware, user.create);
router.post("/login", user.login);
router.post("/verifytoken", user.verifyToken);

// Vehicle Type
router.get("/vehicle-type", authMiddleware, vehicleType.get);
router.post("/vehicle-type", authMiddleware, vehicleType.create);
router.put("/vehicle-type/:id", authMiddleware, vehicleType.update);
router.delete("/vehicle-type/:id", authMiddleware, vehicleType.delete);

// Maintenance
router.get("/maintenance-type", authMiddleware, maintenanceType.get);
router.post("/maintenance-type", authMiddleware, maintenanceType.create);
router.put("/maintenance-type/:id", authMiddleware, maintenanceType.update);
router.delete("/maintenance-type/:id", authMiddleware, maintenanceType.delete);

// Vehicle
router.get("/vehicle", authMiddleware, vehicle.get);
router.post("/vehicle", authMiddleware, vehicle.create);
router.put("/vehicle/:id", authMiddleware, vehicle.update);
router.delete("/vehicle/:id", authMiddleware, vehicle.delete);

// Vehicle Maintenance
router.get("/vehicle-maintenance/:vehicle_id", authMiddleware, vehicleMaintenance.get);
router.post("/vehicle-maintenance", authMiddleware, vehicleMaintenance.create);
router.put("/vehicle-maintenance/:id", authMiddleware, vehicleMaintenance.update);
router.delete("/vehicle-maintenance/:id", authMiddleware, vehicleMaintenance.delete);

router.get("/healthcheck", (req, res) => {
  return res.status(200);
});

module.exports = router;
