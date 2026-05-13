const Member = require("../models/member");

async function isAdmin(req, res, next) {
  const member = await Member.findOne({ studentID: req.user.studentID });
  if (!member || member.role !== "admin") {
    return res.status(403).json({ message: "Access denied! Admins only." });
  }
  next();
}

module.exports = isAdmin;