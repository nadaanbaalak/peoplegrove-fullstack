const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    slot_time: {
      type: String,
      required: true,
    },
    slot_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Slot = mongoose.model("Slot", slotSchema);
module.exports = Slot;
