const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

// ✅ Static files — listen এর আগে
app.use("/photoUploads", express.static(path.join(__dirname, "photoUploads")));

app.use("/api/members", require("./routes/memberRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});