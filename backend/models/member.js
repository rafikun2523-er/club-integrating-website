const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  studentID: { 
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: v => /^081\d{13}$/.test(v),
      message: props => `${props.value} is not a valid BAUET student ID!`
    }
  },
  name: { type: String, required: true },
  batch: { 
    type: Number, 
    required: true, 
    min: 1 // just a basic number check, no dynamic limit
  },
  department: { 
    type: String, 
    required: true, 
    enum: ["CSE","EEE","CE","ME","ICE","BBA","LLB","ELL"]
  },

  email: { 
    type: String, required: true,
    validate: {
      validator: v => /^[\w.-]+@gmail\.com$/.test(v),
      message: props => `${props.value} is not a valid Gmail!`
    }
  },
  phone: { 
    type: String, required: true,
    validate: {
      validator: v => /^01[3-9]\d{8}$/.test(v),
      message: props => `${props.value} is not a valid Bangladeshi phone number!`
    }
  },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  photo: { type: String, default: "" } 
});

module.exports = mongoose.model("Member", MemberSchema);