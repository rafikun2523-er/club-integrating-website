
const clubs = [
  {
    id: "cse",
    name: "Computer Society",
    tag: "Technology",
    icon: "💻",
    color: "#2B2E83",
    desc: "BAUET Computer Society focuses on programming, software development, innovation and leadership through workshops, hackathons and tech competitions.",
    members: 120,
    events: 15,
    since: 2015,
    page: "../html code/cse.html",      // ← your actual file path
    team: ["President", "Vice President", "General Secretary"]
  },
  {
    id: "cultural",
    name: "Photography & Media Club",
    tag: "Culture & Arts",
    icon: "🎭",
    color: "#c0392b",
    desc: "BAUET Cultural Club brings together music, dance, drama, recitation, and art to celebrate creativity, heritage, and the vibrant spirit of our students.",
    members: 80,
    events: 10,
    since: 2016,
    page: "../html code/cultural.html",  // ← your actual file path
    team: ["President", "Vice President", "General Secretary"]
  },
  {
    id: "debate",
    name: "Debating Society",
    tag: "Debate & Speech",
    icon: "🎤",
    color: "#1a5276",
    desc: "BAUET Debate Club focuses on public speaking, critical thinking, and leadership through debates, workshops and competitions.",
    members: 60,
    events: 12,
    since: 2017,
    page: "../html code/debate.html",    // ← your actual file path
    team: ["President", "Vice President", "General Secretary"]
  },
  {
    id: "llcb",
    name: "Language & Literature Club",
    tag: "Language & Literature",
    icon: "📖",
    color: "#6c3483",
    desc: "Enhancing creativity and communication through literature, language, and cultural expression at BAUET.",
    members: 50,
    events: 8,
    since: 2018,
    page: "../html code/llcb.html",      // ← your actual file path
    team: ["President", "Vice President", "General Secretary"]
  },
  {
    id: "nature",
    name: "Nature & Environment Club",
    tag: "Environment",
    icon: "🌿",
    color: "#1e8449",
    desc: "Promoting environmental awareness, sustainability, and nature conservation among BAUET students through campaigns, tree plantations and eco-events.",
    members: 45,
    events: 6,
    since: 2019,
    page: "../html code/nature.html",    // ← your actual file path
    team: ["President", "Vice President", "General Secretary"]
  }
];

// ── Render Cards ──────────────────────────────────────────
function renderClubs() {
  const grid = document.getElementById("clubs-grid");
  if (!grid) return;

  grid.innerHTML = clubs.map(club => `
    <div class="club-card" data-id="${club.id}">
      <div class="club-card-banner" style="background:${club.color}20; border-bottom: 3px solid ${club.color}">
        <div class="club-card-icon" style="background:${club.color}">${club.icon}</div>
      </div>
      <div class="club-card-body">
        <span class="club-tag" style="color:${club.color}; background:${club.color}15">${club.tag}</span>
        <h3 class="club-card-name">${club.name}</h3>
        <p class="club-card-desc">${club.desc.substring(0, 100)}...</p>
        <div class="club-card-stats">
          <span><strong>${club.members}</strong> Members</span>
          <span><strong>${club.events}</strong> Events/yr</span>
          <span>Est. <strong>${club.since}</strong></span>
        </div>
        <div class="club-card-btns">
          <button class="btn-explore" data-id="${club.id}">🔍 Explore Club</button>
          <button class="btn-join" data-page="${club.page}" style="background:${club.color}">Join Club →</button>
        </div>
      </div>
    </div>
  `).join("");

  // Explore → open modal
  document.querySelectorAll(".btn-explore").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.id));
  });

  // Join → navigate to club page
  document.querySelectorAll(".btn-join").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.href = btn.dataset.page;
    });
  });
}

// ── Modal ─────────────────────────────────────────────────
function openModal(id) {
  const club = clubs.find(c => c.id === id);
  if (!club) return;

  document.getElementById("modal-icon").textContent = club.icon;
  document.getElementById("modal-banner").style.background = `linear-gradient(135deg, ${club.color}, ${club.color}99)`;
  document.getElementById("modal-tag").textContent = club.tag;
  document.getElementById("modal-tag").style.cssText = `color:${club.color}; background:${club.color}20`;
  document.getElementById("modal-name").textContent = club.name;
  document.getElementById("modal-desc").textContent = club.desc;
  document.getElementById("modal-members").textContent = club.members;
  document.getElementById("modal-events").textContent = club.events;
  document.getElementById("modal-since").textContent = club.since;

  // Team badges
  document.getElementById("modal-team").innerHTML =
    club.team.map(r => `<span class="team-badge">${r}</span>`).join("");

  // "Join This Club" button inside modal → navigate
  const joinBtn = document.querySelector(".club-modal-box .btn-p");
  if (joinBtn) {
    joinBtn.onclick = () => { window.location.href = club.page; };
  }

  document.getElementById("club-modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("club-modal").classList.remove("active");
  document.body.style.overflow = "";
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderClubs();

  document.getElementById("close-modal")?.addEventListener("click", closeModal);

  document.getElementById("club-modal")?.addEventListener("click", e => {
    if (e.target === document.getElementById("club-modal")) closeModal();
  });
});