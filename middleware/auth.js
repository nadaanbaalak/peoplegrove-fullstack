const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function auth(req, res, next) {
  const token = req.header("auth_token");
  if (!token) {
    return res.status(401).send("Access denied. No Token provided");
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
