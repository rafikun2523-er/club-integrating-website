document.addEventListener("DOMContentLoaded", () => {

  // ── Auth Check ──
  const member = JSON.parse(localStorage.getItem("memberData"));
  if (!member) {
    window.location.href = "../html code/index.html";
    return;
  }

  // ── Fill Member Info ──
  const initials = member.name
    ? member.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const sideAvatarEl = document.getElementById("sideAvatar");
  if (sideAvatarEl) sideAvatarEl.textContent = initials;

  const sideNameEl = document.getElementById("sideName");
  if (sideNameEl) sideNameEl.textContent = member.name || "Member";

  // ── Events Data (admin ready হলে backend থেকে আসবে) ──
  const events = {
    upcoming: [],
    past: []
  };

  // ── Render Events ──
  const container = document.getElementById("eventsContainer");

  function renderEvents(tab) {
    container.innerHTML = "";
    const list = events[tab];

    if (!list || list.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "empty-msg";
      emptyMsg.innerHTML = `
        <i class="fa-solid fa-calendar-xmark"></i>
        <p>${tab === "upcoming"
          ? "No upcoming events yet. Stay tuned!"
          : "No past events available for now."
        }</p>
      `;
      container.appendChild(emptyMsg);
      return;
    }

    list.forEach(event => {
      const card = document.createElement("div");
      card.className = `event-card${tab === "past" ? " past" : ""}`;
      card.innerHTML = `
        <div class="event-card-icon">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="event-card-info">
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <div class="event-meta">
            <span><i class="fa-solid fa-calendar"></i> ${event.date}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ── Tabs ──
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderEvents(btn.dataset.tab);
    });
  });

  // Initial render
  renderEvents("upcoming");

  // ── Side Menu ──
  const menuIcon    = document.getElementById("menuIcon");
  const sideMenu    = document.getElementById("sideMenu");
  const sideOverlay = document.getElementById("sideOverlay");

  function openMenu() {
    sideMenu.classList.add("open");
    sideOverlay.classList.add("show");
  }

  function closeMenu() {
    sideMenu.classList.remove("open");
    sideOverlay.classList.remove("show");
  }

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
