document.addEventListener("DOMContentLoaded", () => {

  // ── Auth Check ──
  const member = JSON.parse(localStorage.getItem("memberData"));
  if (!member) {
    window.location.href = "../html code/index.html";
    return;
  }

  // ── Welcome text ──
  const lastVisit = localStorage.getItem("lastVisit");
  document.getElementById("welcomeText").textContent = lastVisit ? "Welcome back" : "Welcome";
  localStorage.setItem("lastVisit", new Date().toISOString());

  // ── Fill Member Info ──
  const initials = member.name
    ? member.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  document.getElementById("memberName").textContent = member.name    || "Member";
  document.getElementById("metaID").textContent     = member.studentID  || "—";
  document.getElementById("metaDept").textContent   = member.department || "—";
  document.getElementById("metaBatch").textContent  = member.batch      || "—";

  // ── Photo fix ──
  if (member.photo && !member.photo.startsWith("http")) {
    member.photo = "http://localhost:5000" + member.photo;
    localStorage.setItem("memberData", JSON.stringify(member));
  }

  // ── Avatar ──
  function setAvatar(el) {
    if (!el) return;
    if (member.photo && member.photo !== "" && member.photo !== "null") {
      el.style.background = "none";
      el.innerHTML = `<img src="${member.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      el.textContent = initials;
    }
  }

  setAvatar(document.getElementById("avatarCircle"));
  setAvatar(document.getElementById("sideAvatar"));

  // Side name
  const sideNameEl = document.getElementById("sideName");
  if (sideNameEl) sideNameEl.textContent = member.name || "Member";

  // ── Upcoming Events ──
  async function loadUpcomingEvents() {
    const container = document.getElementById("upcomingEventsContainer");

    try {
      const res = await fetch("http://localhost:5000/api/events/upcoming");
      if (!res.ok) throw new Error("No events");

      const events = await res.json();

      if (!events || events.length === 0) {
        showEmptyState(container, "fa-calendar-xmark", "No upcoming events yet. Stay tuned!");
        return;
      }

      // Show max 3 events
      events.slice(0, 3).forEach(event => {
        const date = new Date(event.date);
        const card = document.createElement("div");
        card.className = "event-preview-card";
        card.innerHTML = `
          <div class="event-date-box">
            <span class="day">${date.getDate()}</span>
            <span class="month">${date.toLocaleString("en", { month: "short" })}</span>
          </div>
          <div class="event-preview-info">
            <h3>${event.title}</h3>
            <p><i class="fa-solid fa-location-dot"></i> ${event.location || "TBA"}</p>
          </div>
        `;
        container.appendChild(card);
      });

    } catch (err) {
      // API নেই বা empty — empty state দেখাও
      showEmptyState(container, "fa-calendar-xmark", "No upcoming events yet. Stay tuned!");
    }
  }

  // ── Announcements ──
  async function loadAnnouncements() {
    const container = document.getElementById("announcementsContainer");

    try {
      const res = await fetch("http://localhost:5000/api/announcements");
      if (!res.ok) throw new Error("No announcements");

      const announcements = await res.json();

      if (!announcements || announcements.length === 0) {
        showEmptyState(container, "fa-bullhorn", "No announcements yet.");
        return;
      }

      announcements.slice(0, 4).forEach(ann => {
        const card = document.createElement("div");
        card.className = "announcement-card";
        card.innerHTML = `
          <div class="announcement-dot"></div>
          <div>
            <h3>${ann.title}</h3>
            <p>${ann.message}</p>
            <p class="ann-date">${new Date(ann.createdAt).toLocaleDateString("en-BD")}</p>
          </div>
        `;
        container.appendChild(card);
      });

    } catch (err) {
      showEmptyState(container, "fa-bullhorn", "No announcements yet.");
    }
  }

  // ── Empty State Helper ──
  function showEmptyState(container, icon, msg) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid ${icon}"></i>
        <p>${msg}</p>
      </div>
    `;
  }

  loadUpcomingEvents();
  loadAnnouncements();

  // ── Side Menu ──
  const menuIcon    = document.getElementById("menuIcon");
  const sideMenu    = document.getElementById("sideMenu");
  const sideOverlay = document.getElementById("sideOverlay");

  function openMenu()  { sideMenu.classList.add("open");    sideOverlay.classList.add("show"); }
  function closeMenu() { sideMenu.classList.remove("open"); sideOverlay.classList.remove("show"); }

  menuIcon?.addEventListener("click", () => {
    sideMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  sideOverlay?.addEventListener("click", closeMenu);

  // ── Logout ──
  const sideLogout  = document.getElementById("sideLogout");
  const logoutToast = document.getElementById("logoutToast");

  sideLogout?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    logoutToast.style.display = "flex";
    setTimeout(() => {
      logoutToast.style.display = "none";
      window.location.href = "../html code/index.html";
    }, 1200);
  });

  // ── Notification Bell ──
  const bell     = document.getElementById("notificationBell");
  const dropdown = document.getElementById("notificationDropdown");

  bell?.addEventListener("click", (e) => {
    e.preventDefault();
    const isOpen = dropdown.style.display === "block";
    dropdown.style.display = isOpen ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".notification-wrapper")) {
      if (dropdown) dropdown.style.display = "none";
    }
  });

  const notifications = JSON.parse(localStorage.getItem("clubNotifications") || "[]");
  const notificationList = document.getElementById("notificationList");
  if (notificationList) {
    notificationList.innerHTML = notifications.length
      ? notifications.map(n => `<li>${n}</li>`).join("")
      : "<li>No new notifications</li>";
  }

});
