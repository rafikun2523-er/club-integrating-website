document.addEventListener("DOMContentLoaded", () => {

  // --------------------------
  // Get member data from localStorage
  // --------------------------
  const member = JSON.parse(localStorage.getItem("memberData"));

  if (!member) {
    // Not logged in → redirect to homepage
    window.location.href = "index.html"; // adjust path if needed
    return;
  }

  // --------------------------
  // Update Hero Welcome Name
  // --------------------------
  const memberNameEl = document.getElementById("memberName");
  memberNameEl.textContent = member.name;


  // Fill profile info
  document.getElementById("profileID").textContent = member.studentID;
  document.getElementById("profileName").textContent = member.name;
  document.getElementById("profileBatch").textContent = member.batch;
  document.getElementById("profileDept").textContent = member.department;
  document.getElementById("profileEmail").textContent = member.email;
  document.getElementById("profilePhone").textContent = member.phone;
  document.getElementById("profilePhoto").src = member.photo || "../pic/default-pic.jpg";



  // Close Profile Modal
  closeProfile.addEventListener("click", () => {
    profileModal.style.display = "none";
  });

  // Close modal on outside click
  window.addEventListener("click", (e) => {
    if (e.target === profileModal) profileModal.style.display = "none";
  });

  // --------------------------
  // Logout Button (Side Menu)
  // --------------------------
  const sideLogout = document.getElementById("sideLogout"); // give side menu logout an id in HTML

  sideLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();

    // Create floating logout message
    const msg = document.createElement("div");
    msg.textContent = "You are logged out!";
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.right = "20px";
    msg.style.background = "#2B2E83";
    msg.style.color = "#fff";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "8px";
    msg.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    msg.style.zIndex = 1000;
    document.body.appendChild(msg);

    setTimeout(() => {
      document.body.removeChild(msg);
      window.location.href = "../html code/index.html"; // redirect to homepage
    }, 1000);
  });

  // --------------------------
  // Tabs (Upcoming / Past)
  // --------------------------
  const tabs = document.querySelectorAll(".tab-btn");
  const upcoming = document.getElementById("upcoming");
  const past = document.getElementById("past");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.dataset.target === "upcoming") {
        upcoming.style.display = "grid";
        past.style.display = "none";
      } else {
        upcoming.style.display = "none";
        past.style.display = "grid";
      }
    });
  });

  // --------------------------
  // Side Menu Toggle
  // --------------------------
  const menuIcon = document.getElementById("menuIcon");
  const sideMenu = document.getElementById("sideMenu");

  menuIcon.onclick = function() {
    if (sideMenu.style.left === "0px") {
      sideMenu.style.left = "-250px";
    } else {
      sideMenu.style.left = "0px";
    }
  };

  // --------------------------
  // Notifications
  // --------------------------
  const bell = document.getElementById("notificationBell");
  const dropdown = document.getElementById("notificationDropdown");
  const notificationList = document.getElementById("notificationList");

  // Simulate admin notifications
  let notifications = JSON.parse(localStorage.getItem("clubNotifications") || "[]");

  function populateNotifications() {
    notificationList.innerHTML = notifications.length 
      ? notifications.map(n => `<li>${n}</li>`).join('')
      : "<li>No new notifications</li>";
  }

  // Populate on load
  populateNotifications();

  // Toggle dropdown on bell click
  bell?.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown on click outside
  window.addEventListener("click", (e) => {
    if (e.target !== bell && !dropdown.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });
document.addEventListener("DOMContentLoaded", function(){

let joined = localStorage.getItem("eventsJoined");
let certificates = localStorage.getItem("certificates");
let upcoming = localStorage.getItem("upcomingEvents");

// Events Joined
if(!joined){
    document.getElementById("eventsJoined").innerText = 0;
    document.getElementById("eventsText").innerText = "No events joined yet.";
}else{
    document.getElementById("eventsJoined").innerText = joined;
    document.getElementById("eventsText").innerText = "Total events you participated in.";
}

// Certificates
if(!certificates){
    document.getElementById("certificates").innerText = 0;
    document.getElementById("certText").innerText = "No certificates earned yet.";
}else{
    document.getElementById("certificates").innerText = certificates;
    document.getElementById("certText").innerText = "Certificates you have earned.";
}

// Upcoming Events
if(!upcoming){
    document.getElementById("upcomingEvents").innerText = 0;
    document.getElementById("eventText").innerText = "No upcoming events available.";
}else{
    document.getElementById("upcomingEvents").innerText = upcoming;
    document.getElementById("eventText").innerText = "Events available for registration.";
}

});

});