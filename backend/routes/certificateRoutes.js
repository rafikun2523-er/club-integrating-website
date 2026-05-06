const express = require("express");
const router = express.Router();
const Participation = require("../models/participation");
const authenticateToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");


router.post("/issue/:participationId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const participation = await Participation.findByIdAndUpdate(
      req.params.participationId,
      { certificateIssued: true },
      { new: true }
    );
    if (!participation) return res.status(404).json({ message: "Participation not found!" });
    res.json({ message: "Certificate issued!", participation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/my-certificates", authenticateToken, async (req, res) => {
  try {
    const certificates = await Participation.find({
      studentID: req.user.studentID,
      certificateIssued: true
    }).populate("eventId");
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;