const express = require("express");
const router = express.Router();

const user = require("../controllers/user");
const vehicleType = require("../controllers/vehicle-type");
const maintenance = require("../controllers/maintenance");
const vehicle = require("../controllers/vehicle");
const vehicleMaintenance = require("../controllers/vehicle-maintenance");

// User
router.get("/user", user.get);
router.post("/user", user.create);
router.put("/user", user.update);

// Vehicle Type
router.get("/vehicle-type", vehicleType.get);
router.post("/vehicle-type", vehicleType.create);
router.put("/vehicle-type/:id", vehicleType.update);
router.delete("/vehicle-type/:id", vehicleType.delete);

// Maintenance
router.get("/maintenance", maintenance.get);
router.post("/maintenance", maintenance.create);
router.put("/maintenance/:id", maintenance.update);
router.delete("/maintenance/:id", maintenance.delete);

// Vehicle
router.get("/vehicle", vehicle.get);
router.post("/vehicle", vehicle.create);
router.put("/vehicle/:id", vehicle.update);
router.delete("/vehicle/:id", vehicle.delete);

// Vehicle Maintenance
router.get("/vehicle-maintenance", vehicleMaintenance.get);
router.post("/vehicle-maintenance", vehicleMaintenance.create);
router.put("/vehicle-maintenance/:id", vehicleMaintenance.update);
router.delete("/vehicle-maintenance/:id", vehicleMaintenance.delete);

module.exports = router;
