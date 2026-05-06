const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
connectDB();

app.use(cors({
  origin: (origin, callback) => callback(null, true)
}));
app.use(express.json());

// Rate Limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts! Try again after 15 minutes." }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: "Too many registrations! Try again after 1 hour." }
});

app.use("/api/members/login", loginLimiter);
app.use("/api/members/register", registerLimiter);

// Static files
app.use("/photoUploads", express.static(path.join(__dirname, "photoUploads")));

// Admin Login Route
const AdminSchema = new mongoose.Schema({
  adminId: String,
  password: String
});
const Admin = mongoose.model("admins", AdminSchema);

app.post("/admin-login", async (req, res) => {
  const { adminId, password } = req.body;
  const admin = await Admin.findOne({ adminId, password });
  if (admin) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Routes
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});