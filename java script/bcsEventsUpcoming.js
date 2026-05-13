document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

  // Auth check
  const member = JSON.parse(localStorage.getItem("memberData"));
  if (!member) { window.location.href = "../html code/cse.html"; return; }

  // Fill side menu
  const initials = member.name
    ? member.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const sideAvatarEl = document.getElementById("sideAvatar");
  if (sideAvatarEl) {
    if (member.photo && member.photo !== "") {
      const photoUrl = member.photo.startsWith("http") ? member.photo : BASE_URL + member.photo;
      sideAvatarEl.innerHTML = `<img src="${photoUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      sideAvatarEl.textContent = initials;
    }
  }

  const sideNameEl = document.getElementById("sideName");
  if (sideNameEl) sideNameEl.textContent = member.name || "Member";

  function renderEventCard(container, event) {
    const date = new Date(event.date);
    const card = document.createElement("div");
    card.className = "event-card";

    const encTitle    = encodeURIComponent(event.title);
    const encDate     = encodeURIComponent(event.date || "");
    const encLocation = encodeURIComponent(event.location || "BAUET Campus");
    const encFee      = encodeURIComponent(event.fee || 150);
    const regUrl = `../html code/event-register.html?id=${event._id}&title=${encTitle}&date=${encDate}&location=${encLocation}&fee=${encFee}`;

    card.innerHTML = `
      <div class="event-date-box">
        <span class="day">${isNaN(date) ? "?" : date.getDate()}</span>
        <span class="month">${isNaN(date) ? "—" : date.toLocaleString("en", { month: "short" })}</span>
      </div>
      <div class="event-card-info">
        <h3>${event.title}</h3>
        <p>${event.description || ""}</p>
        <div class="event-meta">
          <span><i class="fa-solid fa-calendar"></i> ${isNaN(date) ? "TBA" : date.toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}</span>
          ${event.location ? `<span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>` : ""}
        </div>
        <a href="${regUrl}" class="reg-btn">
          <i class="fa-solid fa-ticket"></i> Register Now
        </a>
      </div>
    `;
    container.appendChild(card);
  }

  async function loadUpcomingEvents() {
    const container = document.getElementById("eventsContainer");

    
    const FALLBACK = [
      { _id:"f1", title:"BAUET Hackathon 2026",  date:"2026-06-15", location:"Main Auditorium", description:"Annual programming competition for all CSE students.", fee:200 },
      { _id:"f2", title:"CSE Tech Fest 2026",    date:"2026-07-10", location:"Seminar Hall",    description:"Project showcase and tech exhibition.", fee:150 },
      { _id:"f3", title:"Programming Workshop",  date:"2026-07-25", location:"Lab 301",         description:"Hands-on session on competitive programming.", fee:100 },
    ];

    try {
      
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${BASE_URL}/api/events/upcoming`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("API error: " + res.status);

      const events = await res.json();

      if (!events || events.length === 0) {
        showEmpty(container, "No upcoming events yet. Stay tuned!");
        return;
      }

      container.innerHTML = "";
      events.forEach(ev => renderEventCard(container, ev));

    } catch (err) {
      console.warn("Backend unavailable, using fallback:", err.message);
      container.innerHTML = "";
      FALLBACK.forEach(ev => renderEventCard(container, ev));
    }
  }

  function showEmpty(container, msg) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-calendar-xmark"></i>
        <p>${msg}</p>
      </div>
    `;
  }

  loadUpcomingEvents();

  // Side Menu
  const menuIcon    = document.getElementById("menuIcon");
  const sideMenu    = document.getElementById("sideMenu");
  const sideOverlay = document.getElementById("sideOverlay");

  function openMenu()  { sideMenu.classList.add("open");    sideOverlay.classList.add("show"); }
  function closeMenu() { sideMenu.classList.remove("open"); sideOverlay.classList.remove("show"); }

  menuIcon?.addEventListener("click", () => {
    sideMenu.classList.contains("open") ? closeMenu() : openMenu();
  });
  sideOverlay?.addEventListener("click", closeMenu);

  // Logout
  const sideLogout  = document.getElementById("sideLogout");
  const logoutToast = document.getElementById("logoutToast");

  sideLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    logoutToast.style.display = "flex";
    setTimeout(() => {
      logoutToast.style.display = "none";
      window.location.href = "../html code/cse.html";
    }, 1200);
  });

});