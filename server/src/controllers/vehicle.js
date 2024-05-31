class Vehicle {
  get(req, res) {
    res.send("HELLO from Vehicle");
  }

  update(req, res) {
    res.send("update vehicle");
  }

  create(req, res) {
    res.send("create vehicle");
  }

  delete(req, res) {
    res.send("delete vehicle");
  }
}

module.exports = new Vehicle();
