const express    = require("express");
const cors       = require("cors");
const dotenv     = require("dotenv");
const path       = require("path");
const mongoose   = require("mongoose");
const rateLimit  = require("express-rate-limit");
const bcrypt     = require("bcrypt");
const jwt        = require("jsonwebtoken");
const connectDB  = require("./config/db");

dotenv.config();
const app = express();
connectDB();


app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));
app.use(express.json());


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  message: { message: "Too many login attempts! Try again after 15 minutes." }
});
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 5,
  message: { message: "Too many registrations! Try again after 1 hour." }
});
app.use("/api/members/login",    loginLimiter);
app.use("/api/members/register", registerLimiter);
app.use("/admin-login",          loginLimiter);


app.use("/photoUploads", express.static(path.join(__dirname, "photoUploads")));


const ADMIN_JWT_SECRET = process.env.JWT_SECRET || "bauet_admin_jwt_2026";


const AdminSchema = new mongoose.Schema({
  adminId:  { type: String, required: true, unique: true, trim: true },
  name:     { type: String, required: true, trim: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model("admins", AdminSchema);


const NoticeSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  text:      { type: String, required: true },
  category:  { type: String, enum: ["general","event","urgent","achievement"], default: "general" },
  postedBy:  { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now }
});
const Notice = mongoose.model("notices", NoticeSchema);


function requireAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Not authenticated." });

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

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


    const token = jwt.sign(
      { adminId: admin.adminId, name: admin.name, id: admin._id },
      ADMIN_JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ success: true, token, name: admin.name, message: `স্বাগতম, ${admin.name}!` });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Server error।" });
  }
});


app.get("/admin-check", requireAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});


app.get("/admin-logout", (req, res) => {
  res.json({ success: true });
});


app.get("/api/admin/stats", requireAdmin, async (req, res) => {
  try {
    const Member = require("./models/member");
    const Event  = require("./models/events");

    const [totalStudents, totalEvents, totalNotices, recentStudents, recentEvents] =
      await Promise.all([
        Member.countDocuments({ isVerified: true }),
        Event.countDocuments(),
        Notice.countDocuments(),
        Member.find({ isVerified: true }).select("name department batch photo").sort({ _id: -1 }).limit(5),
        Event.find().sort({ date: -1 }).limit(5)
      ]);

    res.json({ totalStudents, totalClubs: 5, totalEvents, totalNotices, recentStudents, recentEvents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const Event = require("./models/events");
const EventRegistration = require("./models/eventRegistration");

app.get("/api/admin/events", requireAdmin, async (req, res) => {
  try { res.json(await Event.find().sort({ date: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/admin/events", requireAdmin, async (req, res) => {
  try {
    const { title, description, date, location, status } = req.body;
    if (!title || !date) return res.status(400).json({ message: "Title and date required." });
    res.status(201).json(await Event.create({ title, description, date, location, status: status || "upcoming" }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put("/api/admin/events/:id", requireAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete("/api/admin/events/:id", requireAdmin, async (req, res) => {
  try { await Event.findByIdAndDelete(req.params.id); res.json({ message: "Event deleted." }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/admin/events/:id/complete", requireAdmin, async (req, res) => {
  try {
    const Registration  = require("./models/registration");
    const Participation = require("./models/participation");
    const event = await Event.findByIdAndUpdate(req.params.id, { status: "completed" }, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found." });
    const regs = await Registration.find({ eventId: req.params.id });
    for (const reg of regs) {
      const exists = await Participation.findOne({ eventId: reg.eventId, studentID: reg.studentID });
      if (!exists) await Participation.create({ eventId: reg.eventId, studentID: reg.studentID });
    }
    res.json({ message: "Event completed!", event });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


app.get("/api/notices", async (req, res) => {
  try { res.json(await Notice.find().sort({ createdAt: -1 }).limit(20)); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/admin/notices", requireAdmin, async (req, res) => {
  try {
    const { title, text, category } = req.body;
    if (!title || !text) return res.status(400).json({ message: "Title and text required." });
    res.status(201).json(await Notice.create({ title, text, category: category || "general", postedBy: req.admin.name }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete("/api/admin/notices/:id", requireAdmin, async (req, res) => {
  try { await Notice.findByIdAndDelete(req.params.id); res.json({ message: "Notice deleted." }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});


const Member = require("./models/member");

app.get("/api/admin/students", requireAdmin, async (req, res) => {
  try {
    res.json(await Member.find({ isVerified: true })
      .select("studentID name batch department email phone photo").sort({ _id: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete("/api/admin/students/:studentID", requireAdmin, async (req, res) => {
  try { await Member.findOneAndDelete({ studentID: req.params.studentID }); res.json({ message: "Student removed." }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});


app.get("/api/public/stats", async (req, res) => {
  try {
    const [totalStudents, totalEvents] = await Promise.all([
      Member.countDocuments({ isVerified: true }),
      Event.countDocuments()
    ]);
    res.json({ totalStudents, totalClubs: 5, totalEvents });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/public/events", async (req, res) => {
  try { res.json(await Event.find({ status: "upcoming" }).sort({ date: 1 }).limit(4)); }
  catch (err) { res.status(500).json({ message: err.message }); }
});



app.get("/api/public/events/all", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});


app.get("/api/public/events/past", async (req, res) => {
  try {
    const events = await Event.find({ status: "completed" }).sort({ date: -1 }).limit(4);
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});


app.get("/api/announcements", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).limit(10);
    res.json(notices.map(n => ({
      _id: n._id, title: n.title, message: n.text,
      category: n.category, createdAt: n.createdAt, postedBy: n.postedBy
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});


app.use("/api/members",      require("./routes/memberRoutes"));
app.use("/api/events",       require("./routes/eventRoutes"));
app.use("/api/certificates", require("./routes/certificateRoutes"));


app.post("/admin-seed", async (req, res) => {
  try {
    const exists = await Admin.findOne({ adminId: "admin1" });
    if (exists) return res.json({ message: "Admin already exists." });
    const hashed = await bcrypt.hash("admin1234", 12);
    await Admin.create({ adminId: "admin1", name: "Ratul", password: hashed });
    res.json({ success: true, message: "Admin created! ID: admin1 | Pass: admin1234" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

const PORT = process.env.PORT || 5000;




app.post("/api/event-registrations", async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.studentId || !data.eventId) {
      return res.status(400).json({ message: "Required fields missing." });
    }
    const exists = await EventRegistration.findOne({ eventId: data.eventId, studentId: data.studentId });
    if (exists) return res.status(409).json({ message: "Already registered for this event." });
    const reg = await EventRegistration.create({
      refId: data.refId || ("REG-" + Date.now()),
      eventId: data.eventId, eventTitle: data.eventTitle,
      name: data.name, studentId: data.studentId,
      email: data.email, phone: data.phone,
      department: data.department, batch: data.batch,
      reason: data.reason || "",
      payMethod: data.payMethod, txnId: data.txnId || "Cash Payment",
      fee: data.fee || "0", status: "pending"
    });
    res.status(201).json({ message: "Registration submitted!", refId: reg.refId });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


app.get("/api/admin/event-registrations", requireAdmin, async (req, res) => {
  try { res.json(await EventRegistration.find().sort({ submittedAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});


app.patch("/api/admin/event-registrations/:refId/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved","rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status." });
    const reg = await EventRegistration.findOneAndUpdate(
      { refId: req.params.refId }, { status }, { new: true }
    );
    if (!reg) return res.status(404).json({ message: "Registration not found." });
    res.json({ message: `Registration ${status}.`, reg });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
