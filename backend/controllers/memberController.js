const Member = require("../models/member");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "photoUploads/");
  },
  filename: function (req, file, cb) {
    cb(null, req.user.studentID + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Register Member
exports.registerMember = async (req, res) => {
  try {
    const { studentID, name, batch, department, email, phone, password } = req.body;

    const existing = await Member.findOne({ studentID });
    if (existing) return res.status(400).json({ message: "Student already registered!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = new Member({
      studentID, name, batch, department, email, phone, password: hashedPassword
    });

    await newMember.save();
    res.status(201).json({ message: "Registration Successful! You can now login." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Upload Profile Photo
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

    const member = await Member.findOne({ studentID: req.user.studentID });
    if (!member) return res.status(404).json({ message: "Member not found!" });

    member.photo = `/photoUploads/${req.file.filename}`;
    await member.save();

    res.json({ photo: member.photo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// Login Member
exports.loginMember = async (req, res) => {
  try {
    const { studentID, password } = req.body;
    const member = await Member.findOne({ studentID });
    if (!member) return res.status(400).json({ message: "Student not registered!" });

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid ID or Password" });

    // Create JWT
    const token = jwt.sign({ studentID: member.studentID }, process.env.JWT_SECRET || "MY_SECRET_KEY", { expiresIn: "7d" });

    res.json({ token, member: { studentID: member.studentID, name: member.name, photo: member.photo } });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.upload = upload;