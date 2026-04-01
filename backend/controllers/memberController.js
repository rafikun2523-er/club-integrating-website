const Member = require("../models/member");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const sendOTP = require("../utils/sendOTP");

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

    // ✅ Email check যোগ করো
const emailExists = await Member.findOne({ email });
if (emailExists) return res.status(400).json({ message: "This email is already registered!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newMember = new Member({
      studentID, name, batch, department, email, phone,
      password: hashedPassword,
      otp, otpExpiry,
      isVerified: false
    });

    await newMember.save();
    await sendOTP(email, otp);

    res.status(201).json({ message: "Registration successful! Check your email for OTP." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Member
exports.loginMember = async (req, res) => {
  try {
    const { studentID, password } = req.body;
    const member = await Member.findOne({ studentID });
    if (!member) return res.status(400).json({ message: "Student not registered!" });

    // ✅ Verified check
    if (!member.isVerified) {
      return res.status(403).json({ 
        message: "Please verify your email first!" 
      });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid ID or Password" });

    const token = jwt.sign(
      { studentID: member.studentID },
      process.env.JWT_SECRET || "MY_SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({ token, member: { 
      studentID: member.studentID, 
      name: member.name, 
      photo: member.photo,
      batch: member.batch,
      department: member.department,
      email: member.email,
      phone: member.phone
    }});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const member = await Member.findOne({ studentID: req.user.studentID });
    if (!member) return res.status(404).json({ message: "Member not found!" });

    const isMatch = await bcrypt.compare(oldPassword, member.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect!" });

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    member.password = hashedPassword;
    await member.save();

    res.json({ message: "Password updated successfully!" });

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

exports.upload = upload;