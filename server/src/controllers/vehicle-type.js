class VehicleType {
  get(req, res) {
    res.send("HELLO from vehicle type");
  }

  update(req, res) {
    res.send("update vehicle type");
  }

  create(req, res) {
    res.send("create vehicle type");
  }

  delete(req, res) {
    res.send("delete vehicle type");
  }
}

module.exports = new VehicleType();
