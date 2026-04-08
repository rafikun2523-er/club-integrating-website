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

  async function loadUpcomingEvents() {
    const container = document.getElementById("eventsContainer");
    try {
      const res = await fetch(`${BASE_URL}/api/events/upcoming`);
      if (!res.ok) throw new Error("No events");
      const events = await res.json();
      if (!events || events.length === 0) {
        showEmpty(container, "No upcoming events yet. Stay tuned!");
        return;
      }
      events.forEach(event => {
        const date = new Date(event.date);
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
          <div class="event-date-box">
            <span class="day">${date.getDate()}</span>
            <span class="month">${date.toLocaleString("en", { month: "short" })}</span>
          </div>
          <div class="event-card-info">
            <h3>${event.title}</h3>
            <p>${event.description || ""}</p>
            <div class="event-meta">
              <span><i class="fa-solid fa-calendar"></i> ${date.toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}</span>
              ${event.location ? `<span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>` : ""}
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } catch {
      showEmpty(container, "No upcoming events yet. Stay tuned!");
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
