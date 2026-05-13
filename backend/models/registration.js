const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  eventId:      { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  studentID:    { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

RegistrationSchema.index({ eventId: 1, studentID: 1 }, { unique: true });

module.exports = mongoose.model("Registration", RegistrationSchema);