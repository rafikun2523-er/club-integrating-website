document.addEventListener("DOMContentLoaded", () => {

  // ── Auth Check ──
  const member = JSON.parse(localStorage.getItem("memberData"));
  if (!member) {
    window.location.href = "../html code/index.html";
    return;
  }

  const token = localStorage.getItem("token");

  // ── Avatar ──
  const initials = member.name
    ? member.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

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

  const sideNameEl = document.getElementById("sideName");
  if (sideNameEl) sideNameEl.textContent = member.name || "Member";

  // ── Load Participation ──
  async function loadParticipation() {
    const container = document.getElementById("participationContainer");

    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>
    `;

    try {
      const res = await fetch(`${BASE_URL}/api/events/my-participation`, {
        headers: { "Authorization": "Bearer " + token }
      });

      const data = await res.json();

      if (!data || data.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-laptop"></i>
            <p>You haven't participated in any events yet.</p>
          </div>
        `;
        return;
      }

      document.getElementById("totalCount").textContent = data.length;

      container.innerHTML = "";

      data.forEach(p => {
        const event = p.eventId;
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
            <p><i class="fa-solid fa-award" style="color:${p.certificateIssued ? '#00bfff' : '#ccc'}"></i> 
              ${p.certificateIssued ? "Certificate Issued ✅" : "Certificate Pending"}
            </p>
          </div>
        `;
        container.appendChild(card);
      });

    } catch (err) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-exclamation"></i>
          <p>Could not load participation data.</p>
        </div>
      `;
    }
  }

  loadParticipation();

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

});