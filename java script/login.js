const BASE_URL = window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : ``;

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


function showPopup(message, type = "error") {
  const popup = document.getElementById("popup");
  const msg = document.getElementById("popup-message");
  if (!popup || !msg) return;
  msg.innerText = message;
  popup.className = `popup show ${type}`;
  clearTimeout(window._pt);
  window._pt = setTimeout(closePopup, 3000);
}
function closePopup() {
  const p = document.getElementById("popup");
  if (p) p.className = "popup";
}


function getAdminPath() {
  // Current page: .../html code/admin-login.html
  // Target:       .../html code/admin.html
  const cur = window.location.pathname;
  return cur.replace("admin-login.html", "admin.html");
}

async function login() {
  const adminId = document.getElementById("adminId").value.trim();
  const password = document.getElementById("password").value;
  const btn = document.querySelector(".login-box button[onclick='login()']");

  if (!adminId || !password) {
    showPopup("Admin ID and Password are required.", "error");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Logging in...';
  }

  try {
    const res = await fetch(`${BASE_URL}/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId, password })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminName", data.name);
      localStorage.setItem("adminId", adminId);
      localStorage.setItem("adminLoggedIn", "true");

      showPopup(`✅ Welcome, ${data.name}!`, "success");

      setTimeout(() => {
        window.location.href = getAdminPath();
      }, 900);

    } else {
      showPopup(data.message || "Invalid ID or Password", "error");
    }

  } catch (err) {
    console.error(err);
    showPopup("Server not connected . ", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = "Login";
    }
  }
}


document.addEventListener("keydown", e => {
  if (e.key === "Enter") login();
});


window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");
  if (token) {

    fetch(`${BASE_URL}/admin-check`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          window.location.href = getAdminPath();
        } else {

          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminName");
        }
      })
      .catch(() => {

        localStorage.removeItem("adminToken");
      });
  }
});
