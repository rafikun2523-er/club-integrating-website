const express = require("express");
const router = express.Router();
const Member = require("../models/member");
const memberController = require("../controllers/memberController");
const authenticateToken = require("../middleware/auth");

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
    const members = await Member.find()
      .select("studentID name batch department photo")
      .sort({ batch: -1 });
    res.json(members);
  } catch (err) {
    console.error("Error fetching members:", err);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;