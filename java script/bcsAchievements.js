document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  const achievements = [];
  const grid          = document.getElementById("achievementGrid");
  const emptyState    = document.getElementById("emptyState");
  const statsBar      = document.getElementById("statsBar");
  const filterSection = document.getElementById("filterSection");
  const hamburgerBtn  = document.getElementById("hamburgerBtn");
  const mobileNav     = document.querySelector(".navbar nav");
  const joinBtn       = document.getElementById("joinBtn");
  const loginModal    = document.getElementById("loginModal");

  // ── Achievements ──
  if (achievements.length === 0) {
    statsBar.style.display     = "none";
    filterSection.style.display = "none";
    emptyState.style.display    = "block";
  } else {
    renderAchievements();
    initStats();
  }

  function renderAchievements(filter = "all") {
    const filtered = filter === "all"
      ? achievements
      : achievements.filter(a => a.category === filter);
    grid.innerHTML = "";
    if (filtered.length === 0) { emptyState.style.display = "block"; return; }
    emptyState.style.display = "none";
    filtered.forEach((ach, i) => {
      const card = document.createElement("div");
      card.className = "ach-card";
      card.style.animationDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="ach-card-top">
          <i class="${ach.icon}"></i>
          <span class="ach-badge badge-${ach.badge}">${ach.badge.charAt(0).toUpperCase() + ach.badge.slice(1)}</span>
        </div>
        <div class="ach-card-body">
          <h3>${ach.title}</h3>
          <p>${ach.desc}</p>
          <div class="ach-meta">
            <span><i class="fa-regular fa-calendar"></i>${ach.date}</span>
            <span><i class="fa-solid fa-users"></i>${ach.members}</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderAchievements(tab.dataset.filter);
    });
  });

  // ── Hamburger ──
  hamburgerBtn?.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    mobileNav.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("header.navbar")) {
      mobileNav?.classList.remove("open");
      hamburgerBtn?.classList.remove("active");
    }
  });

  // ── Mobile Login ──
  document.getElementById("mobileLoginBtn")?.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    hamburgerBtn.classList.remove("active");
    loginModal?.classList.add("active");
  });

  // ── Login Modal ──
  joinBtn?.addEventListener("click", () => loginModal?.classList.add("active"));

  document.querySelector(".close")?.addEventListener("click", () => {
    loginModal?.classList.remove("active");
  });

  loginModal?.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.classList.remove("active");
  });

  // ── Login Submit ──
  document.getElementById("loginSubmit")?.addEventListener("click", async () => {
    const id       = document.getElementById("loginID").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!id || !password) { alert("Please enter both ID and password!"); return; }
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
        window.location.href = "../html code/bcsDashboard.html";
      } else {
        alert(data?.message || "Login failed!");
      }
    } catch { alert("Could not connect to server!"); }
  });

  // ── Eye Toggle ──
  document.querySelectorAll(".toggle-eye").forEach(eye => {
    eye.addEventListener("click", () => {
      const input = eye.parentElement.querySelector("input");
      input.type = input.type === "password" ? "text" : "password";
      eye.classList.toggle("fa-eye");
      eye.classList.toggle("fa-eye-slash");
    });
  });

  // ── Scroll to Top ──
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollTopBtn?.classList.toggle("show", window.scrollY > 400);
  });
  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── Active Navbar Link ──
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navbar nav a").forEach(link => {
    if (link.getAttribute("href")?.split("/").pop() === currentPage) {
      link.classList.add("active");
    }
  });

});