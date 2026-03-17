document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

  function showToast(msg, isError = false) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: ${isError ? "linear-gradient(135deg,#8b0000,#c0392b)" : "linear-gradient(135deg,#1a1d6e,#2B2E83)"};
      color: white; padding: 12px 32px; border-radius: 10px; min-width: 280px; text-align: center;
      font-family: 'Cinzel', serif; font-size: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 9999;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
  }

  // Upcoming card — login check
  const upcomingCard = document.getElementById("upcomingCard");
  const loginModal   = document.getElementById("loginModal");

  upcomingCard?.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "../html code/bcsEventsUpcoming.html";
    } else {
      loginModal.classList.add("active");
    }
  });

  // Modal close
  document.querySelector(".close")?.addEventListener("click", () => {
    loginModal.classList.remove("active");
  });

  loginModal?.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.classList.remove("active");
  });

  // Login
  document.getElementById("loginSubmit")?.addEventListener("click", async () => {
    const id       = document.getElementById("loginID").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!id || !password) { showToast("Please enter both ID and password!", true); return; }

    try {
      const res  = await fetch(`${BASE_URL}/api/members/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentID: id, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("memberData", JSON.stringify(data.member));
        showToast("✓ Login Successful!");
        setTimeout(() => {
          window.location.href = "../html code/bcsEventsUpcoming.html";
        }, 1000);
      } else {
        showToast(data?.message || "Login failed!", true);
      }
    } catch { showToast("Could not connect to server!", true); }
  });

  // Eye toggle
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

  // Mobile Navbar
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav    = document.getElementById("mobileNav");

  hamburgerBtn?.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    mobileNav.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("header.navbar") && !e.target.closest(".mobile-nav")) {
      mobileNav?.classList.remove("open");
      hamburgerBtn?.classList.remove("active");
    }
  });

});
