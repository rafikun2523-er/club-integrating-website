const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// connect database
connectDB();

// middleware
app.use(cors({
  origin: "http://127.0.0.1:5500" // Live Server URL
}));
app.use(express.json());

// routes
app.use("/api/members", require("./routes/memberRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/photoUploads", express.static(path.join(__dirname, "photoUploads")));
// JSON body parsing
app.use(express.json());
app.use("/api/members", require("./routes/memberRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"));