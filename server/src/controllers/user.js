class User {
  get(req, res) {
    res.send("HELLO from User");
  }

  update(req, res) {
    res.send("update user");
  }

  create(req, res) {
    res.send("create user");
  }
}

module.exports = new User();
