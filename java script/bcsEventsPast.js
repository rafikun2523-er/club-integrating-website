document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

  async function loadPastEvents() {
    const container = document.getElementById("eventsContainer");
    try {
      const res = await fetch(`${BASE_URL}/api/events/past`);
      if (!res.ok) throw new Error("No events");
      const events = await res.json();
      if (!events || events.length === 0) {
        showEmpty(container, "No past events yet. Stay tuned for upcoming activities!");
        return;
      }
      events.forEach(event => {
        const date = new Date(event.date);
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
          <div class="event-date-box">
            <span class="day">${date.getDate()}</span>
            <span class="month">${date.toLocaleString("en", { month: "short" })}</span>
          </div>
          <div class="event-card-info">
            <h3>${event.title}</h3>
            <p>${event.description || ""}</p>
            <div class="event-meta">
              <span><i class="fa-solid fa-calendar"></i> ${date.toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}</span>
              ${event.location ? `<span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>` : ""}
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } catch {
      showEmpty(container, "No past events yet. Stay tuned for upcoming activities!");
    }
  }

  function showEmpty(container, msg) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-calendar-xmark"></i>
        <p>${msg}</p>
      </div>
    `;
  }

  loadPastEvents();

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
