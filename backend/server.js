const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
connectDB();

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(express.json());

// ── Session ───────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || "bauet_admin_secret_2026",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 2  // 2 ঘণ্টা
  }
}));

// ── Rate Limiters ─────────────────────────────
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
app.use("/admin-login", loginLimiter);

// ── Static files ──────────────────────────────
app.use("/photoUploads", express.static(path.join(__dirname, "photoUploads")));

// ── Admin Model ───────────────────────────────
const AdminSchema = new mongoose.Schema({
  adminId:  { type: String, required: true, unique: true, trim: true },
  name:     { type: String, required: true, trim: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model("admins", AdminSchema);

// ── POST /admin-login ─────────────────────────
app.post("/admin-login", async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password)
      return res.status(400).json({ success: false, message: "ID এবং Password দিন।" });

    const admin = await Admin.findOne({ adminId: adminId.trim() });
    if (!admin)
      return res.status(401).json({ success: false, message: "Admin ID সঠিক নয়।" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Password সঠিক নয়।" });

    req.session.admin = {
      id:      admin._id,
      adminId: admin.adminId,
      name:    admin.name
    };

    return res.json({ success: true, name: admin.name, message: `স্বাগতম, ${admin.name}!` });

  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Server error।" });
  }
});

// ── GET /admin-check ──────────────────────────
app.get("/admin-check", (req, res) => {
  if (req.session && req.session.admin)
    return res.json({ success: true, admin: req.session.admin });
  return res.status(401).json({ success: false });
});

// ── GET /admin-logout ─────────────────────────
app.get("/admin-logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

// ── Other Routes ──────────────────────────────
app.use("/api/members",      require("./routes/memberRoutes"));
app.use("/api/events",       require("./routes/eventRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
