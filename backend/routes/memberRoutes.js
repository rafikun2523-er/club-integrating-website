const express = require("express");
const router = express.Router();

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
module.exports = router;