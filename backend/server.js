const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: (origin, callback) => callback(null, true) // ✅ সব allow
}));

app.use(express.json());

// ✅ Static files — listen এর আগে
app.use("/photoUploads", express.static(path.join(__dirname, "photoUploads")));

app.use("/api/members", require("./routes/memberRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});