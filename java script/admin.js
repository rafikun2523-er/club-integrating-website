// ===============================
// 🌐 BASE URL
// ===============================
const BASE_URL = "http://localhost:5000";


// ===============================
// 📊 LOAD DASHBOARD COUNTS
// ===============================
function loadDashboard(){

// Students Count
fetch(`${BASE_URL}/students`)
.then(res=>res.json())
.then(data=>{
document.querySelector(".card:nth-child(1) p").innerText = data.length;
});

// Clubs Count
fetch(`${BASE_URL}/clubs`)
.then(res=>res.json())
.then(data=>{
document.querySelector(".card:nth-child(2) p").innerText = data.length;
});

// Events Count
fetch(`${BASE_URL}/events`)
.then(res=>res.json())
.then(data=>{
document.querySelector(".card:nth-child(3) p").innerText = data.length;
});

}


// ===============================
// 🎯 ADD EVENT
// ===============================
function addEvent(){

let title = prompt("Enter Event Name:");
let date = prompt("Enter Date:");

if(!title || !date){
alert("All fields required!");
return;
}

fetch(`${BASE_URL}/events/add`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({title,date})
})
.then(res=>res.json())
.then(()=>{
alert("Event Added Successfully!");
loadEvents();
loadDashboard();
});

}


// ===============================
// 📅 LOAD EVENTS
// ===============================
function loadEvents(){

fetch(`${BASE_URL}/events`)
.then(res=>res.json())
.then(data=>{

let table = document.querySelector(".admin-section table");
table.innerHTML = `
<tr>
<th>Event</th>
<th>Date</th>
<th>Action</th>
</tr>
`;

data.forEach(event=>{
table.innerHTML += `
<tr>
<td>${event.title}</td>
<td>${event.date}</td>
<td>
<button onclick="deleteEvent('${event._id}')">Delete</button>
</td>
</tr>
`;
});

});

}


// ===============================
// ❌ DELETE EVENT
// ===============================
function deleteEvent(id){

fetch(`${BASE_URL}/events/delete/${id}`,{
method:"DELETE"
})
.then(()=>{
alert("Event Deleted");
loadEvents();
loadDashboard();
});

}


// ===============================
// 📢 ADD NOTICE
// ===============================
function addNotice(){

let text = document.querySelector("textarea").value;

if(!text){
alert("Write something!");
return;
}

fetch(`${BASE_URL}/notices/add`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({text})
})
.then(()=>{
alert("Notice Published!");
document.querySelector("textarea").value="";
});

}


// ===============================
// 👨‍🎓 LOAD STUDENTS
// ===============================
function loadStudents(){

fetch(`${BASE_URL}/students`)
.then(res=>res.json())
.then(data=>{

let table = document.querySelectorAll(".admin-section table")[2];

table.innerHTML = `
<tr>
<th>Name</th>
<th>ID</th>
<th>Department</th>
</tr>
`;

data.forEach(st=>{
table.innerHTML += `
<tr>
<td>${st.name}</td>
<td>${st.studentId}</td>
<td>${st.department}</td>
</tr>
`;
});

});

}


// ===============================
// 🏫 ADD CLUB
// ===============================
function addClub(){

let name = prompt("Club Name:");
let president = prompt("President:");
let vicePresident = prompt("Vice President:");

if(!name) return;

fetch(`${BASE_URL}/clubs/add`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({name,president,vicePresident})
})
.then(()=>{
alert("Club Added!");
location.reload();
});

}


// ===============================
// 🚀 INITIAL LOAD
// ===============================
window.onload = function(){

loadDashboard();
loadEvents();
loadStudents();

};
function addNotice(){

let text = document.getElementById("noticeText").value;

if(!text){
alert("Write something!");
return;
}

fetch("http://localhost:5000/notices/add",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({text})
})
.then(res=>res.json())
.then(data=>{
alert("Notice Published!");
document.getElementById("noticeText").value="";
})
.catch(err=>{
console.log(err);
alert("Error publishing notice");
});

}