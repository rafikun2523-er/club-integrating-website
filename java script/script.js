
document.addEventListener("DOMContentLoaded", () => {

  // ── Navbar scroll shadow ──────────────────
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 20);
    scrollTopBtn?.classList.toggle("show", window.scrollY > 300);
  });

  // ── Hamburger mobile menu ─────────────────
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("open");
  });
  // Close menu when a link is clicked
  mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });

  // ── Scroll to top ─────────────────────────
  const scrollTopBtn = document.getElementById("scrollTop");
  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── Animated counter for stats ───────────
  const stats = document.querySelectorAll(".stat[data-target]");

  const runCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const numEl  = el.querySelector(".stat-num");
    if (!numEl) return;
    let current = 0;
    const step  = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      numEl.textContent = current + "+";
      if (current >= target) clearInterval(timer);
    }, 30);
  };

  // Use IntersectionObserver to trigger when stats enter view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  stats.forEach(s => statsObserver.observe(s));

  // ── Fade-in on scroll for cards ──────────
  const fadeEls = document.querySelectorAll(
    ".feat-card, .event-item, .achieve-card, .announce-item, .notif-item"
  );

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger based on sibling index
        const siblings = [...el.parentElement.children];
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * 60}ms`;
        el.classList.add("visible");
        fadeObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => {
    el.style.opacity  = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    fadeObserver.observe(el);
  });

  // Add .visible handler via CSS injection
  const style = document.createElement("style");
  style.textContent = `
    .feat-card.visible, .event-item.visible,
    .achieve-card.visible, .announce-item.visible,
    .notif-item.visible {
      opacity: 1 !important;
      transform: none !important;
    }
  `;
  document.head.appendChild(style);

  // ── Smooth scroll for anchor links ───────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

});
