document.addEventListener("DOMContentLoaded", () => {
  const member = JSON.parse(localStorage.getItem("memberData"));
  if (!member) {
    window.location.href = "index.html"; // redirect if not logged in
    return;
  }

  // logout button
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../html code/index.html";
  });

  // ---------- Events logic ----------
  const events = {
    upcoming: [], // admin will fill later
    past: []
  };

  const tabButtons = document.querySelectorAll(".tab-btn");
  const eventsList = document.getElementById("eventsList");

  function renderEvents(tab) {
    eventsList.innerHTML = "";

    if (!events[tab] || events[tab].length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.classList.add("empty-msg");
      emptyMsg.textContent = "No events to display yet.";
      eventsList.appendChild(emptyMsg);
      return;
    }

    events[tab].forEach(event => {
      const card = document.createElement("div");
      card.classList.add("event-card");
      card.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.date} | ${event.location}</p>
        <p>${event.description}</p>
      `;
      eventsList.appendChild(card);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderEvents(btn.dataset.tab);
    });
  });

  renderEvents("upcoming");
});