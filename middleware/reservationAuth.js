const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function reservationAuth(req, res, next) {
  const token = req.header("auth_token");

  try {
    if (token !== "") {
      const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
      req.user = decoded; //meeting Scheduler
    } else {
      req.user = { name: "Anonymous" }; //meeting scheduler
    }
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
