const express = require("express");
const router = express.Router();
const Event = require("../models/events");
const Registration = require("../models/registration");
const Participation = require("../models/participation");
const authenticateToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");


router.get("/past", async (req, res) => {
  try {
    const events = await Event.find({ status: "completed" }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/upcoming", authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({ status: "upcoming" }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/register/:eventId", authenticateToken, async (req, res) => {
  try {
    const existing = await Registration.findOne({
      eventId: req.params.eventId,
      studentID: req.user.studentID
    });
    if (existing) return res.status(400).json({ message: "Already registered!" });

    await Registration.create({
      eventId: req.params.eventId,
      studentID: req.user.studentID
    });

    res.json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/create", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const event = await Event.create({ title, description, date, location });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/complete/:eventId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { status: "completed" },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found!" });

    
    const registrations = await Registration.find({ eventId: req.params.eventId });
    for (const reg of registrations) {
      await Participation.create({
        eventId: reg.eventId,
        studentID: reg.studentID
      });
    }

    res.json({ message: "Event completed!", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/my-participation", authenticateToken, async (req, res) => {
  try {
    const participations = await Participation.find({ 
      studentID: req.user.studentID 
    }).populate("eventId");
    res.json(participations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/registrations/:eventId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;