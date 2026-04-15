
const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
require("dotenv").config();

const AdminSchema = new mongoose.Schema({
  adminId:  { type: String, required: true, unique: true, trim: true },
  name:     { type: String, required: true, trim: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model("admins", AdminSchema);


const ADMIN_ID   = "admin1";     
const ADMIN_NAME = "Ratul";  
const ADMIN_PASS = "admin1234";     

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const exists = await Admin.findOne({ adminId: ADMIN_ID });
    if (exists) {
      console.log("⚠️  Admin already exists. Delete it first to re-seed.");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN_PASS, 12);
    await Admin.create({ adminId: ADMIN_ID, name: ADMIN_NAME, password: hashed });

    console.log("✅ Admin created successfully!");
    console.log(`   ID       : ${ADMIN_ID}`);
    console.log(`   Name     : ${ADMIN_NAME}`);
    console.log(`   Password : ${ADMIN_PASS}`);
    console.log("\n🔒 Delete this file or add it to .gitignore.");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seed();