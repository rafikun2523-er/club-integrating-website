const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const rateLimit = require("express-rate-limit"); // ✅ উপরে
const connectDB = require("./config/db");

dotenv.config();
const app = express();
connectDB();

app.use(cors({
  origin: (origin, callback) => callback(null, true)
}));
app.use(express.json());

// ✅ Rate Limiters — routes এর আগে
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

// ✅ Static files
app.use("/photoUploads", express.static(path.join(__dirname, "photoUploads")));

// ✅ Routes
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});