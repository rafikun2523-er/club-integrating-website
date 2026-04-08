const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: "" },
  date:        { type: Date, required: true },
  location:    { type: String, default: "TBA" },
  status:      { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventSchema);