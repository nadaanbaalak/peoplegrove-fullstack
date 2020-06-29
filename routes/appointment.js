const express = require("express");
const reservationAuth = require("../middleware/reservationAuth");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Appointment = require("../models/Appointment");

const User = require("../models/User");

const router = express.Router();

router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.find({ username: req.params.username });
    //console.log(user);
    const appointments = await Appointment.find({ owner: user[0]._id }).sort({
      appointment_date: 1,
      appointment_time: 1,
    });
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

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    console.log(appointment);
    if (appointment.owner.toString() !== req.user._id) {
      res.status(401).json({ msg: "Not Allowed" });
    }
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    await appointment.delete();
    res.status(200).send(appointment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
