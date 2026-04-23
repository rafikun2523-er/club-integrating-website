// =============================================
//  java script/admin-guard.js
// =============================================

const BASE_URL = window.location.hostname === "localhost" ||
                 window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;

function getAdminToken() {
  return localStorage.getItem("adminToken");
}

// সব admin API call এর জন্য
function adminFetch(url, options = {}) {
  const token = getAdminToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
      ...(options.headers || {})
    }
  });
}

// ── Page load guard ───────────────────────────
(async () => {
  const token = getAdminToken();

  if (!token) {
    window.location.replace("admin-login.html");
    return;
  }

  try {
    const res  = await adminFetch(`${BASE_URL}/admin-check`);
    const data = await res.json();

    if (!data.success) {
      // token invalid বা expired
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");
      window.location.replace("admin-login.html");
      return;
    }

    // নাম set করা
    const name = data.admin.name || localStorage.getItem("adminName") || "Admin";
    localStorage.setItem("adminName", name);

    const ids = ["adminWelcomeName", "welcomeNameBig"];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = name;
    });
    const av = document.getElementById("adminAvatar");
    if (av) av.textContent = name[0].toUpperCase();

  } catch (err) {
    // server connect error — token clear করে login এ পাঠাও
    console.error("Admin check failed:", err);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    window.location.replace("admin-login.html");
  }
})();

// ── Logout ────────────────────────────────────
async function adminLogout() {
  try { await adminFetch(`${BASE_URL}/admin-logout`); } catch (_) {}
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminId");
  localStorage.removeItem("adminLoggedIn");
  window.location.replace("admin-login.html");
}