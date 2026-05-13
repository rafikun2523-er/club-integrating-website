const mongoose = require("mongoose");

const EventRegistrationSchema = new mongoose.Schema({
  refId:       { type: String, required: true, unique: true },
  eventId:     { type: String, required: true },
  eventTitle:  { type: String, required: true },
  name:        { type: String, required: true },
  studentId:   { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  department:  { type: String, required: true },
  batch:       { type: String, required: true },
  reason:      { type: String, default: "" },
  payMethod:   { type: String, enum: ["bkash","nagad","rocket","cash"], required: true },
  txnId:       { type: String, default: "Cash Payment" },
  fee:         { type: String, default: "0" },
  status:      { type: String, enum: ["pending","approved","rejected"], default: "pending" },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EventRegistration", EventRegistrationSchema);
