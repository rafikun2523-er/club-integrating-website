const BASE_URL = window.location.hostname === "localhost" ||
                 window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;

// ── Eye Toggle ────────────────────────────────
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

// ── Popup ─────────────────────────────────────
function showPopup(message, type = "error") {
  const popup = document.getElementById("popup");
  const msg   = document.getElementById("popup-message");
  if (!popup || !msg) return;
  msg.innerText   = message;
  popup.className = `popup show ${type}`;
  clearTimeout(window._pt);
  window._pt = setTimeout(closePopup, 3000);
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.className = "popup";
}

// ── Login ─────────────────────────────────────
async function login() {
  const adminId  = document.getElementById("adminId").value.trim();
  const password = document.getElementById("password").value;
  const btn      = document.querySelector(".login-box button[onclick='login()']");

  if (!adminId || !password) {
    showPopup("Please enter Admin ID and Password.", "error");
    return;
  }

  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Logging in...'; }

  try {
    const res  = await fetch(`${BASE_URL}/admin-login`, {
      method:      "POST",
      headers:     { "Content-Type": "application/json" },
      credentials: "include",
      body:        JSON.stringify({ adminId, password })
    });
    const data = await res.json();

    if (data.success) {
      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminName",     data.name);
      sessionStorage.setItem("adminId",       adminId);

      showPopup(`✅ Welcome, ${data.name}!`, "success");
      setTimeout(() => { window.location.href = "../html code/admin.html"; }, 1000);

    } else {
      showPopup(data.message || "Invalid ID or Password", "error");
    }

  } catch (err) {
    console.error(err);
    showPopup("Server is not connected", "error");
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = "Login"; }
  }
}

// ── Enter key ────────────────────────────────
document.addEventListener("keydown", e => { if (e.key === "Enter") login(); });

// ── Already logged in? ────────────────────────
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res  = await fetch(`${BASE_URL}/admin-check`, { credentials: "include" });
    const data = await res.json();
    if (data.success) window.location.href = "../html code/admin.html";
  } catch (_) {}
});
