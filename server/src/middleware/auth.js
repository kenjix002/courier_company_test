const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const bearerJWT = req.headers.authorization;

  try {
    if (!bearerJWT) {
      return res.status(401).json({ message: "token not provided." });
    }

    const token = bearerJWT.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "invalid token." });
      }

      req.decoded = decoded;
      return next();
    });
  } catch (err) {
    return res.status(500).json({ message: "failed to authenticate." });
  }
};

module.exports = auth;
