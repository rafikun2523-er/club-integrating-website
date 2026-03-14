const express = require("express");
const router = express.Router();

const memberController = require("../controllers/memberController");
const authenticateToken = require("../middleware/auth");

const {
  registerMember,
  loginMember
  
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

module.exports = router;