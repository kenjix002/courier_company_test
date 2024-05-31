class VehicleMaintenance {
  get(req, res) {
    res.send("HELLO from VehicleMaintenance");
  }

  update(req, res) {
    res.send("update VehicleMaintenance");
  }

  create(req, res) {
    res.send("create VehicleMaintenance");
  }

  delete(req, res) {
    res.send("delete VehicleMaintenance");
  }
}

module.exports = new VehicleMaintenance();
