const express = require("express");
const router = express.Router();
const Member = require("../models/member");
const memberController = require("../controllers/memberController");
const authenticateToken = require("../middleware/auth");
const sendOTP = require("../utils/sendOTP");

const {
  registerMember,
  loginMember,
  changePassword
} = require("../controllers/memberController");

router.post("/register", registerMember);
router.post("/login", loginMember);

// profile photo upload
router.post(
  "/upload-photo",
  authenticateToken,
  memberController.upload.single("photo"),
  memberController.uploadPhoto
);
router.post(
  "/change-password",
  authenticateToken,
  changePassword
);
// Get all members — public
router.get("/all", async (req, res) => {
  try {
    const members = await Member.find({ isVerified: true })
  .select("name batch department photo")
  .sort({ batch: -1 });
    res.json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ message: err.message });
  }
});
// OTP Verify
router.post("/verify-otp", async (req, res) => {
  try {
    const { studentID, otp } = req.body;

    const member = await Member.findOne({ studentID });
    if (!member) return res.status(404).json({ message: "Member not found!" });

    // Already verified?
    if (member.isVerified) return res.status(400).json({ message: "Already verified!" });

    // OTP match?
    if (member.otp !== otp) return res.status(400).json({ message: "Invalid OTP!" });

    // OTP expire?
    if (member.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired! Register again." });
    }

    // ✅ Verify করো
    member.isVerified = true;
    member.otp = "";
    member.otpExpiry = null;
    await member.save();

    res.json({ message: "Email verified successfully! You can now login." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { studentID } = req.body;

    const member = await Member.findOne({ studentID });
    if (!member) return res.status(404).json({ message: "Member not found!" });

    if (member.isVerified) return res.status(400).json({ message: "Already verified!" });

    // নতুন OTP generate করো
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    member.otp = otp;
    member.otpExpiry = otpExpiry;
    await member.save();

    await sendOTP(member.email, otp);

    res.json({ message: "OTP resent successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;