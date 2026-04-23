// =============================================
//  java script/bcsDashboard.js
//  Student Dashboard — live data from DB
// =============================================

document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

  const token  = localStorage.getItem("token");
  const member = JSON.parse(localStorage.getItem("memberData") || "null");

  if (!member) { window.location.href = "../html code/index.html"; return; }

  // ── Welcome ───────────────────────────────
  const lastVisit = localStorage.getItem("lastVisit");
  const welcomeEl = document.getElementById("welcomeText");
  if (welcomeEl) welcomeEl.textContent = lastVisit ? "Welcome back" : "Welcome";
  localStorage.setItem("lastVisit", new Date().toISOString());

  // ── Member info ───────────────────────────
  const initials = member.name
    ? member.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "?";

  const set = (id, val) => { const el=document.getElementById(id); if(el) el.textContent=val; };
  set("memberName", member.name || "Member");
  set("metaID",     member.studentID  || "—");
  set("metaDept",   member.department || "—");
  set("metaBatch",  member.batch      || "—");

  if (member.photo && !member.photo.startsWith("http")) {
    member.photo = BASE_URL + member.photo;
    localStorage.setItem("memberData", JSON.stringify(member));
  }

  function setAvatar(el) {
    if (!el) return;
    if (member.photo) {
      el.style.background = "none";
      el.innerHTML = `<img src="${member.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.textContent='${initials}'">`;
    } else { el.textContent = initials; }
  }
  setAvatar(document.getElementById("avatarCircle"));
  setAvatar(document.getElementById("sideAvatar"));
  set("sideName", member.name || "Member");

  // ── Upcoming Events ───────────────────────
  async function loadUpcomingEvents() {
    const c = document.getElementById("upcomingEventsContainer");
    if (!c) return;
    try {
      const res    = await fetch(`${BASE_URL}/api/events/upcoming`, {
        headers: token ? { "Authorization": "Bearer "+token } : {}
      });
      if (!res.ok) throw new Error();
      const events = await res.json();
      if (!events.length) { showEmpty(c,"fa-calendar-xmark","No upcoming events yet."); return; }
      c.innerHTML = "";
      events.slice(0,3).forEach(e => {
        const d = new Date(e.date);
        const card = document.createElement("div");
        card.className = "event-preview-card";
        card.style.cursor = "pointer";
        card.innerHTML = `
          <div class="event-date-box">
            <span class="day">${d.getDate()}</span>
            <span class="month">${d.toLocaleString("en",{month:"short"})}</span>
          </div>
          <div class="event-preview-info">
            <h3>${e.title}</h3>
            <p><i class="fa-solid fa-location-dot"></i> ${e.location||"TBA"}</p>
            ${e.description?`<p style="font-size:12px;color:#888;margin-top:4px">${e.description.slice(0,60)}…</p>`:""}
          </div>`;
        c.appendChild(card);
      });
    } catch { showEmpty(c,"fa-calendar-xmark","No upcoming events yet."); }
  }

  // ── Announcements — from /api/notices ─────
  async function loadAnnouncements() {
    const c = document.getElementById("announcementsContainer");
    if (!c) return;
    try {
      const res     = await fetch(`${BASE_URL}/api/notices`);
      if (!res.ok) throw new Error();
      const notices = await res.json();
      if (!notices.length) { showEmpty(c,"fa-bullhorn","No announcements yet."); return; }

      const dotColors = { general:"#2B2E83", event:"#e67e22", urgent:"#e74c3c", achievement:"#1e8449" };
      c.innerHTML = "";
      notices.slice(0,5).forEach(n => {
        const dot  = dotColors[n.category] || "#2B2E83";
        const card = document.createElement("div");
        card.className = "announcement-card";
        card.style.cursor = "pointer";
        card.innerHTML = `
          <div class="announcement-dot" style="background:${dot}"></div>
          <div>
            <h3>${n.title}</h3>
            <p>${n.text}</p>
            <p class="ann-date">${new Date(n.createdAt).toLocaleDateString("en-BD",{day:"numeric",month:"short",year:"numeric"})}</p>
          </div>`;
        c.appendChild(card);
      });
    } catch { showEmpty(c,"fa-bullhorn","No announcements yet."); }
  }

  // ── Notification dropdown ─────────────────
  async function loadNotificationBell() {
    const list = document.getElementById("notificationList");
    if (!list) return;
    try {
      const res     = await fetch(`${BASE_URL}/api/notices`);
      const notices = await res.json();
      if (!notices.length) { list.innerHTML = "<li>No new notifications</li>"; return; }
      list.innerHTML = notices.slice(0,5).map(n =>
        `<li style="padding:8px 0;border-bottom:1px solid #f0f0f0">
          <strong style="font-size:13px">${n.title}</strong><br>
          <span style="font-size:12px;color:#888">${n.text.slice(0,60)}${n.text.length>60?"…":""}</span>
        </li>`
      ).join("");
    } catch { list.innerHTML = "<li>No new notifications</li>"; }
  }

  function showEmpty(c, icon, msg) {
    c.innerHTML = `<div class="empty-state"><i class="fa-solid ${icon}"></i><p>${msg}</p></div>`;
  }

  loadUpcomingEvents();
  loadAnnouncements();
  loadNotificationBell();

  // ── Side Menu ─────────────────────────────
  const menuIcon    = document.getElementById("menuIcon");
  const sideMenu    = document.getElementById("sideMenu");
  const sideOverlay = document.getElementById("sideOverlay");
  const openMenu  = () => { sideMenu?.classList.add("open");    sideOverlay?.classList.add("show"); };
  const closeMenu = () => { sideMenu?.classList.remove("open"); sideOverlay?.classList.remove("show"); };
  menuIcon?.addEventListener("click", () => sideMenu?.classList.contains("open") ? closeMenu() : openMenu());
  sideOverlay?.addEventListener("click", closeMenu);

  // ── Logout ────────────────────────────────
  document.getElementById("sideLogout")?.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("memberData");
    localStorage.removeItem("lastVisit");
    const toast = document.getElementById("logoutToast");
    if (toast) toast.style.display = "flex";
    setTimeout(() => { window.location.href = "../html code/index.html"; }, 1200);
  });

  // ── Notification bell ─────────────────────
  const bell     = document.getElementById("notificationBell");
  const dropdown = document.getElementById("notificationDropdown");
  bell?.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdown) dropdown.style.display = dropdown.style.display==="block" ? "none" : "block";
  });
  document.addEventListener("click", e => {
    if (!e.target.closest(".notification-wrapper") && dropdown)
      dropdown.style.display = "none";
  });

});
