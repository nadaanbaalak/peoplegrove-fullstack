const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

const router = express.Router();

//Logging In
router.post(
  "/",
  [
    check("email", "Email is Required").isEmail(),
    check(
      "password",
      "Password is required and should be atleast 6 characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send({ errors: error.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send("Invalid email or Password");
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(400).send("Invalid email or Password");
      const token = user.generateAuthToken();
      res.send(token);
    } catch (err) {
      next(err); //err is the first argument in the error middleware that would be called
    }
  }
);

module.exports = router;
