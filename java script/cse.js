document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

  function showToast(msg, isError = false) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: ${isError ? "linear-gradient(135deg, #8b0000, #c0392b)" : "linear-gradient(135deg, #1a1d6e, #2B2E83)"};
      color: white; padding: 12px 24px; border-radius: 10px;
      font-family: 'Cinzel', serif; font-size: 14px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 9999;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
  }

  const batchInput = document.getElementById("regBatch");
  const baseYear = 2015;
  const now = new Date();
  const semester = (now.getMonth() + 1) <= 6 ? 1 : 2;
  const maxBatch = (now.getFullYear() - baseYear) * 2 + semester;
  if (batchInput) {
    batchInput.min = 1;
    batchInput.max = maxBatch;
    batchInput.placeholder = `Batch (1-${maxBatch})`;
  }

  const joinBtn        = document.getElementById("joinBtn");
  const loginModal     = document.getElementById("loginModal");
  const registerModal  = document.getElementById("registerModal");
  const closeBtns      = document.querySelectorAll(".close");
  const openRegister   = document.getElementById("openRegister");
  const registerSubmit = document.getElementById("registerSubmit");
  const loginSubmit    = document.getElementById("loginSubmit");

  joinBtn?.addEventListener("click", () => loginModal.classList.add("active"));
  document.getElementById("joinBtn2")?.addEventListener("click", () => registerModal.classList.add("active"));

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      loginModal.classList.remove("active");
      registerModal.classList.remove("active");
    });
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        loginModal.classList.remove("active");
        registerModal.classList.remove("active");
      }
    });
  });

  openRegister?.addEventListener("click", () => {
    loginModal.classList.remove("active");
    registerModal.classList.add("active");
  });

  registerSubmit?.addEventListener("click", async () => {
    const id       = document.getElementById("regID").value.trim();
    const name     = document.getElementById("regName").value.trim();
    const batch    = Number(document.getElementById("regBatch").value.trim());
    const dept     = document.getElementById("regDept").value.trim();
    const email    = document.getElementById("regEmail").value.trim();
    const phone    = document.getElementById("regPhone").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm  = document.getElementById("regConfirm").value;

    if (!id || !name || !batch || !dept || !email || !phone || !password || !confirm) {
      showToast("Please fill all required fields!", true); return;
    }
    if (password !== confirm) { showToast("Passwords do not match!", true); return; }
    if (password.length < 6) { showToast("Password must be at least 6 characters!", true); return; }

    try {
      const res = await fetch(`${BASE_URL}/api/members/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentID: id, name, batch, department: dept, email, phone, password })
      });
      let data;
      try { data = await res.json(); } catch { data = {}; }
      if (res.ok) {
        registerModal.classList.remove("active");
        loginModal.classList.add("active");
        document.getElementById("loginID").value = id;
        showToast("✓ Registration Successful! You can now login.");
      } else {
        showToast(data?.message || "Registration failed!", true);
      }
    } catch (err) {
      showToast("Could not connect to server!", true);
    }
  });

  loginSubmit?.addEventListener("click", async () => {
    const id       = document.getElementById("loginID").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!id || !password) { showToast("Please enter both ID and password!", true); return; }
    try {
      const res = await fetch(`${BASE_URL}/api/members/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentID: id, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("memberData", JSON.stringify(data.member));
        showToast("✓ Login Successful!");
        setTimeout(() => { window.location.href = "bcsDashboard.html"; }, 1000);
      } else {
        showToast(data?.message || "Login failed!", true);
      }
    } catch (err) {
      showToast("Could not connect to server!", true);
    }
  });

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

  const revealSections = document.querySelectorAll(".why-join, .achievements");
  function scrollReveal() {
    const triggerBottom = window.innerHeight * 0.9;
    revealSections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        section.classList.add("show");
        section.querySelectorAll(".join-card, .achievement-card").forEach((card, i) => {
          setTimeout(() => card.classList.add("show"), i * 150);
        });
      }
    });
  }
  window.addEventListener("scroll", scrollReveal);
  window.addEventListener("load", scrollReveal);
  setTimeout(scrollReveal, 300);

  const mvoSection = document.querySelector(".mvo-section");
  const mvoCards   = document.querySelectorAll(".mvo-card");
  function revealMVO() {
    const triggerBottom = window.innerHeight * 0.85;
    if (mvoSection) {
      const sectionTop = mvoSection.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        mvoSection.classList.add("show");
        mvoCards.forEach((card, index) => {
          setTimeout(() => card.classList.add("show"), index * 150);
        });
      }
    }
  }
  window.addEventListener("scroll", revealMVO);
  window.addEventListener("load", revealMVO);

  document.querySelectorAll(".faq-question-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const item   = btn.parentElement;
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  const popup = document.getElementById("welcomePopup");
  popup?.classList.add("show");
  setTimeout(() => popup?.classList.remove("show"), 4000);

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
    });
  });

  const scrollTopBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollTopBtn?.classList.toggle("show", window.scrollY > 400);
  });
  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const achievements = [];
  function loadAchievements() {
    const container = document.getElementById("achievementCards");
    const noMsg     = document.getElementById("noAchievementsMsg");
    if (!container) return;
    container.innerHTML = "";
    if (achievements.length === 0) { noMsg.style.display = "block"; return; }
    noMsg.style.display = "none";
    achievements.forEach(ach => {
      const card = document.createElement("div");
      card.className = "achievement-card";
      card.innerHTML = `<img src="${ach.photo}" alt="${ach.title}"><div class="achievement-info"><h3>${ach.title}</h3><p>${ach.description}</p></div>`;
      container.appendChild(card);
    });
  }
  loadAchievements();

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav    = document.querySelector(".navbar nav");

  hamburgerBtn?.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    mobileNav.classList.toggle("open");
  });

  const dropdown = document.querySelector(".navbar .dropdown");
  const dropbtn  = dropdown?.querySelector("a.dropbtn");
  dropbtn?.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) { e.preventDefault(); dropdown.classList.toggle("open"); }
  });

  document.getElementById("mobileLoginBtn")?.addEventListener("click", () => {
    loginModal.classList.add("active");
    mobileNav.classList.remove("open");
    hamburgerBtn.classList.remove("active");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("header.navbar")) {
      mobileNav?.classList.remove("open");
      hamburgerBtn?.classList.remove("active");
    }
  });

  document.getElementById("eventsNavLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "../html code/bcsEvents.html?tab=past";
    } else {
      loginModal.classList.add("active");
    }
  });

});
