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

  // ── Load Certificates ──
  async function loadCertificates() {
    const container = document.getElementById("certificatesContainer");

    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>
    `;

    try {
      const res = await fetch(`${BASE_URL}/api/certificates/my-certificates`, {
        headers: { "Authorization": "Bearer " + token }
      });

      const data = await res.json();

      if (!data || data.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-award"></i>
            <p>No certificates yet. Participate in events to earn certificates!</p>
          </div>
        `;
        return;
      }

      document.getElementById("totalCount").textContent = data.length;
      container.innerHTML = "";

      data.forEach(cert => {
        const event = cert.eventId;
        const date  = new Date(event.date);
        const issuedDate = new Date(cert.confirmedAt);

        const card = document.createElement("div");
        card.className = "announcement-card";
        card.style.cssText = `
          background: linear-gradient(135deg, #f0f4ff, #ffffff);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          border-left: 4px solid #3a4fcf;
        `;
        card.innerHTML = `
          <div class="announcement-dot" style="background:#00bfff"></div>
          <div style="flex:1">
            <h3 style="font-family:'Cinzel',serif;font-size:14px;color:#2B2E83;margin-bottom:6px;">
              <i class="fa-solid fa-award" style="color:#00bfff;margin-right:6px;"></i>
              ${event.title}
            </h3>
            <p style="font-size:13px;color:#777;font-family:'Crimson Text',serif;">
              <i class="fa-solid fa-location-dot" style="color:#3a4fcf"></i> ${event.location || "TBA"}
            </p>
            <p style="font-size:13px;color:#777;font-family:'Crimson Text',serif;">
              <i class="fa-solid fa-calendar" style="color:#3a4fcf"></i> 
              Event: ${date.toLocaleDateString("en-BD", { year:"numeric", month:"long", day:"numeric" })}
            </p>
            <p class="ann-date">
              <i class="fa-solid fa-check-circle" style="color:#00bfff"></i> 
              Issued: ${issuedDate.toLocaleDateString("en-BD", { year:"numeric", month:"long", day:"numeric" })}
            </p>
          </div>
        `;
        container.appendChild(card);
      });

    } catch (err) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-exclamation"></i>
          <p>Could not load certificates.</p>
        </div>
      `;
    }
  }

  loadCertificates();

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