

const BASE_URL = window.location.hostname === "localhost" ||
                 window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;

(async () => {
  try {
    const res  = await fetch(`${BASE_URL}/admin-check`, { credentials: "include" });
    const data = await res.json();

    if (!data.success) {
     
      window.location.href = "../html code/adminLogin.html";
      return;
    }

  
    const nameEl = document.getElementById("adminWelcomeName");
    if (nameEl) nameEl.textContent = data.admin.name;

  } catch (_) {
   
    window.location.href = "../html code/adminLogin.html";
  }
})();

// ── Logout function ───────────────────────────
async function adminLogout() {
  try {
    await fetch(`${BASE_URL}/admin-logout`, { credentials: "include" });
  } catch (_) {}
  sessionStorage.clear();
  window.location.href = "../html code/adminLogin.html";
}