const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/clubDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


// admin schema

const adminSchema = new mongoose.Schema({

adminId:String,
password:String

});

const Admin = mongoose.model("Admin",adminSchema);


// login api

app.post("/login",async(req,res)=>{

const {adminId,password} = req.body;

const admin = await Admin.findOne({adminId,password});

if(admin){

res.json({success:true});

}
else{

res.json({success:false});

}

});


app.listen(5000,()=>{

console.log("Server running on port 5000");

});