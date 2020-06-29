const express = require("express");
const reservationAuth = require("../middleware/reservationAuth");
const { check, validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");

const User = require("../models/User");

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

router.post(
  "/:username",
  [
    reservationAuth,
    [
      check("appointment_date", "Reservation Date is Required").not().isEmpty(),
      check("appointment_time", "Appointment time is Required").not().isEmpty(),
    ],
  ],
  async (req, res, next) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        console.log("Inside api validation");
        return res.status(400).send({ errors: error.array() });
      }
      const user = await User.find({ username: req.params.username });

      const appointment = new Appointment({
        ...req.body,
        name: req.user.name,
        owner: user[0]._id,
      });

      await appointment.save();

      res.status(200).send(appointment);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
