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

  document.getElementById("memberName").textContent = member.name || "Member";
  document.getElementById("memberMeta").textContent =
    `${member.department || ""}  |  Batch ${member.batch || ""}  |  BAUET Computer Society`;

  // Avatar initials
  const avatarEl = document.getElementById("avatarCircle");
  if (avatarEl) avatarEl.textContent = initials;

  const sideAvatarEl = document.getElementById("sideAvatar");
  if (sideAvatarEl) sideAvatarEl.textContent = initials;

  const sideNameEl = document.getElementById("sideName");
  if (sideNameEl) sideNameEl.textContent = member.name || "Member";

  // Profile modal fields
  document.getElementById("profileID").textContent    = member.studentID  || "—";
  document.getElementById("profileName").textContent  = member.name       || "—";
  document.getElementById("profileBatch").textContent = member.batch      || "—";
  document.getElementById("profileDept").textContent  = member.department || "—";
  document.getElementById("profileEmail").textContent = member.email      || "—";
  document.getElementById("profilePhone").textContent = member.phone      || "—";

  const profilePhotoEl = document.getElementById("profilePhoto");
  if (profilePhotoEl && member.photo) {
    profilePhotoEl.src = member.photo;
  }

  // ── Profile Card → open modal ──
  const profileModal  = document.getElementById("profileModal");
  const closeProfile  = document.getElementById("closeProfile");
  const profileCard   = document.getElementById("profileCard");

  profileCard?.addEventListener("click", () => {
    profileModal.classList.add("active");
  });

  closeProfile?.addEventListener("click", () => {
    profileModal.classList.remove("active");
  });

  profileModal?.addEventListener("click", (e) => {
    if (e.target === profileModal) profileModal.classList.remove("active");
  });

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

  // Populate notifications from localStorage
  const notifications = JSON.parse(localStorage.getItem("clubNotifications") || "[]");
  const notificationList = document.getElementById("notificationList");

  if (notificationList) {
    notificationList.innerHTML = notifications.length
      ? notifications.map(n => `<li>${n}</li>`).join("")
      : "<li>No new notifications</li>";
  }

});
