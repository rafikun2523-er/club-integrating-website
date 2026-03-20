document.addEventListener("DOMContentLoaded", () => {

  // ── Dark Mode Sync ──
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  // ── Achievements Data (replace with backend fetch later) ──
  const achievements = [];

  // ── DOM Elements ──
  const grid        = document.getElementById("achievementGrid");
  const emptyState  = document.getElementById("emptyState");
  const statsBar    = document.getElementById("statsBar");
  const filterSection = document.getElementById("filterSection");

  // ── Render Achievements ──
  function renderAchievements(filter = "all") {
    const filtered = filter === "all"
      ? achievements
      : achievements.filter(a => a.category === filter);

    grid.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    filtered.forEach((ach, i) => {
      const card = document.createElement("div");
      card.className = "ach-card";
      card.style.animationDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="ach-card-top">
          <i class="${ach.icon}"></i>
          <span class="ach-badge badge-${ach.badge}">
            ${ach.badge.charAt(0).toUpperCase() + ach.badge.slice(1)}
          </span>
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

  // ── Hide stats & filter if no data ──
  if (achievements.length === 0) {
    statsBar.style.display = "none";
    filterSection.style.display = "none";
    emptyState.style.display = "block";
  } else {
    renderAchievements();
    initStats();
  }

  // ── Filter Tabs ──
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderAchievements(tab.dataset.filter);
    });
  });

  // ── Stats Counter Animation ──
  function animateCounter(el, target, suffix = "") {
    let count = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = count + suffix;
    }, 40);
  }

  function initStats() {
    const statsData = [
      { id: "statTotal",        target: achievements.length,                                    suffix: "" },
      { id: "statCompetitions", target: achievements.filter(a => a.category === "competition").length, suffix: "" },
      { id: "statWorkshops",    target: achievements.filter(a => a.category === "workshop").length,    suffix: "" },
      { id: "statMembers",      target: 120,                                                    suffix: "+" }
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          statsData.forEach(s => {
            animateCounter(document.getElementById(s.id), s.target, s.suffix);
          });
          observer.disconnect();
        }
      });
    });

    observer.observe(document.querySelector(".stats-bar"));
  }

  // ── Hamburger Menu ──
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav    = document.querySelector(".navbar nav");

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

  // ── Mobile Login Button ──
  document.getElementById("mobileLoginBtn")?.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    hamburgerBtn.classList.remove("active");
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
document.querySelectorAll(".navbar nav a, .navbar nav .dropbt").forEach(link => {
  const linkPage = link.getAttribute("href")?.split("/").pop();
  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});
});
