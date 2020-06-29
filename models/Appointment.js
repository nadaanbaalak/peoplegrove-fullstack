const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Anonymous",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
      required: true,
    },
    appointment_date: {
      type: Date,
      required: true,
    },
    appointment_time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
