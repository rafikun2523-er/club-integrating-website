document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;

  // ── Auth Check ──
  let member = null;
  try { member = JSON.parse(localStorage.getItem("memberData")); }
  catch (err) { console.error("Invalid localStorage data"); }

  if (!member) {
    window.location.href = "../html code/index.html";
    return;
  }

  // ── Toast Helper ──
  function showToast(msg, isError = false) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.style.background = isError
      ? "linear-gradient(135deg, #8b0000, #c0392b)"
      : "linear-gradient(135deg, #1a1d6e, #2B2E83)";
    toast.style.display = "flex";
    setTimeout(() => { toast.style.display = "none"; }, 3000);
  }

  // ── Fill Member Info ──
  const initials = member.name
    ? member.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  document.getElementById("avatarCircle").textContent   = initials;
  document.getElementById("profileNameDisplay").textContent = member.name       || "—";
  document.getElementById("profileDeptDisplay").textContent = member.department || "—";
  document.getElementById("studentID").textContent  = member.studentID  || "—";
  document.getElementById("name").textContent       = member.name       || "—";
  document.getElementById("batch").textContent      = member.batch      || "—";
  document.getElementById("department").textContent = member.department || "—";
  document.getElementById("email").textContent      = member.email      || "—";
  document.getElementById("phone").textContent      = member.phone      || "—";
  

  // Side menu
  const sideAvatarEl = document.getElementById("sideAvatar");
  if (sideAvatarEl) sideAvatarEl.textContent = initials;
  const sideNameEl = document.getElementById("sideName");
  if (sideNameEl) sideNameEl.textContent = member.name || "Member";

  // ── Profile Photo ──
  const avatarCircle = document.getElementById("avatarCircle");
  const profileImage = document.getElementById("profileImage");

  function updatePhoto() {
  if (member.photo && member.photo !== "" && member.photo !== "null") {
    const photoUrl = member.photo.startsWith("http")
      ? member.photo
     : BASE_URL + member.photo;
     
    profileImage.src = photoUrl;
    profileImage.style.display = "block";
    avatarCircle.style.display = "none";
  } else {
    profileImage.style.display = "none";
    avatarCircle.style.display = "flex";
    avatarCircle.textContent = initials;
  }
}
updatePhoto();

  // ── Upload Photo ──
  const uploadInput = document.getElementById("uploadImage");

  uploadInput?.addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("File too large! Max 2MB.", true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) { showToast("Please login first!", true); return; }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`${BASE_URL}/api/members/upload-photo`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        member.photo = BASE_URL + data.photo;
        localStorage.setItem("memberData", JSON.stringify(member));
        updatePhoto();
        showToast("✓ Photo updated successfully!");
        uploadInput.value = "";
      } else {
        showToast(data?.message || "Upload failed!", true);
      }
    } catch (err) {
      console.error(err);
      showToast("Could not connect to server!", true);
    }
  });

  // ── Password Toggle ──
  const openPassword  = document.getElementById("openPassword");
  const passwordForm  = document.getElementById("passwordForm");

  openPassword?.addEventListener("click", () => {
    passwordForm.classList.toggle("open");
  });

  // ── Eye Toggle ──
  document.querySelectorAll(".toggle-eye").forEach(eye => {
    eye.addEventListener("click", () => {
      const input = eye.parentElement.querySelector("input");
      if (input.type === "password") {
        input.type = "text";
        eye.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        eye.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  // ── Change Password ──
  const changePasswordBtn = document.getElementById("changePassword");

  changePasswordBtn?.addEventListener("click", async () => {
    const oldPass     = document.getElementById("oldPass").value.trim();
    const newPass     = document.getElementById("newPass").value.trim();
    const confirmPass = document.getElementById("confirmPass").value.trim();

    if (!oldPass || !newPass || !confirmPass) {
      showToast("Please fill all fields!", true);
      return;
    }

    if (newPass.length < 6) {
      showToast("New password must be at least 6 characters!", true);
      return;
    }

    if (newPass !== confirmPass) {
      showToast("Passwords do not match!", true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) { showToast("Please login first!", true); return; }

    try {
      const res = await fetch(`${BASE_URL}/api/members/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
      });

      const data = await res.json();

      if (res.ok) {
  showToast("✓ Password updated successfully!");
  document.getElementById("oldPass").value     = "";
  document.getElementById("newPass").value     = "";
  document.getElementById("confirmPass").value = "";
  passwordForm.classList.remove("open");
} else {
  // alert() বাদ দিয়ে toast দেখাও
  showToast(data?.message || "Password update failed!", true);
}
    } catch (err) {
      console.error(err);
      showToast("Could not connect to server!", true);
    }
  });

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
