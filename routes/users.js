const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");

const _ = require("lodash");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

//getting the current user
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
});

//Registering new user
router.post(
  "/",
  [
    check("username", "Username is Required").not().isEmpty(),
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Email is Required").isEmail(),
    check("password", "Password needs to be of atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send({ errors: error.array() });
    }
    const { email, username, password, name, timezone } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).send("User already Registered");
      }
      user = new User({
        email,
        username,
        password,
        name,
        timezone,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      const token = user.generateAuthToken();
      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token") //needed for client to be able to read this custom header
        .send(_.pick(user, ["username", "name", "email"]));
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

module.exports = router;
