const mongoose = require("mongoose");

const ParticipationSchema = new mongoose.Schema({
  eventId:           { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  studentID:         { type: String, required: true },
  confirmedAt:       { type: Date, default: Date.now },
  certificateIssued: { type: Boolean, default: false }
});

module.exports = mongoose.model("Participation", ParticipationSchema);