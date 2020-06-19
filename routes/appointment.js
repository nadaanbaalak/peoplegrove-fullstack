const express = require("express");
const { check, validationResult } = require("express-validator");

const Appointment = require("../models/Appointment");

const router = express.Router();

router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.find({ username: req.params.username });
    const appointments = await Appointment.find({ owner: user._id });
    if (!appointments) {
      return res.status(400).send("No appointments for the user");
    }
    res.status(200).send(appointments);
  } catch (err) {
    next(err);
  }
});
