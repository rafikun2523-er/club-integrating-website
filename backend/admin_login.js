const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/Unified_club_portal")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

const AdminSchema = new mongoose.Schema({
  adminId:String,
  password:String
});

const Admin = mongoose.model("admins",AdminSchema);


app.post("/admin-login", async (req,res)=>{

const {adminId,password}=req.body;

const admin = await Admin.findOne({
adminId:adminId,
password:password
})

if(admin){
res.json({success:true})
}else{
res.json({success:false})
}

});


app.listen(5000,()=>{
console.log("Server running on port 5000")
});