class Maintenance {
  get(req, res) {
    res.send("HELLO from Maintenance");
  }

  update(req, res) {
    res.send("update Maintenance");
  }

  create(req, res) {
    res.send("create Maintenance");
  }

  delete(req, res) {
    res.send("delete maintenance");
  }
}

module.exports = new Maintenance();
