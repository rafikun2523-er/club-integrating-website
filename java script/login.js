function login() {

let id = document.getElementById("adminId").value.trim();
let pass = document.getElementById("password").value.trim();

let popup = document.getElementById("popup");
let message = document.getElementById("popup-message");

if (id === "" || pass === "") {

message.innerHTML = `
<div style="background:#ff9800;color:white;padding:12px;border-radius:8px;font-weight:bold;">
⚠ Please fill all fields!
</div>
`;

popup.style.display="flex";
return;

}


// API request to Node.js server
fetch("http://localhost:27017/Unified_club_portal/admins",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
adminId:id,
password:pass
})

})

.then(res=>res.json())

.then(data=>{

if(data.success){

localStorage.setItem("adminId", id);

message.innerHTML = `
<div style="background:#28a745;color:white;padding:12px;border-radius:8px;font-weight:bold;">
✔ Login Successful!
</div>
`;

popup.style.display="flex";

setTimeout(()=>{
popup.style.display="none";
window.location.href="admin-dashboard.html";
},1500);

}else{

message.innerHTML = `
<div style="background:#ff4c4c;color:white;padding:12px;border-radius:8px;font-weight:bold;">
❌ Invalid Admin ID or Password!
</div>
`;

popup.style.display="flex";

}

})

}