
const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;


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
    page: "../html code/cse.html",
    team: ["President", "Vice President", "General Secretary", "IT Secretary"]
  },
  {
    id: "cultural",
    name: "Photography & Media Club",
    tag: "Culture & Arts",
    icon: "🎭",
    color: "#a93226",
    desc: "BAUET Cultural Club brings together music, dance, drama, recitation, and art to celebrate creativity, heritage, and the vibrant spirit of our students.",
    members: 0,
    events: 0,
    since: 2016,
    page: "../html code/cultural.html",
    team: ["President", "Vice President", "General SECRETARY", "Cultural Secretary"]
  },
  {
    id: "debate",
    name: "Debating Society",
    tag: "Debate & Speech",
    icon: "🎤",
    color: "#1a5276",
    desc: "BAUET Debate Club focuses on public speaking, critical thinking, and leadership through debates, workshops and national competitions.",
    members: 0,
    events: 0,
    since: 2017,
    page: "../html code/debate.html",
    team: ["President", "Vice President", "General SECRETARY", "Publicity Secretary"]
  },
  {
    id: "llcb",
    name: "Language & Literature Club",
    tag: "Language & Literature",
    icon: "📖",
    color: "#6c3483",
    desc: "Enhancing creativity and communication through literature, language, and cultural expression at BAUET.",
    members: 0,
    events: 0,
    since: 2018,
    page: "../html code/llcb.html",
    team: ["President", "Vice President", "General SECRETARY", "IT Secretary"]
  },
  {
    id: "nature",
    name: "Nature & Environment Club",
    tag: "Environment",
    icon: "🌿",
    color: "#1e6b3c",
    desc: "Promoting environmental awareness, sustainability, and nature conservation through campaigns, tree plantations and eco-events at BAUET.",
    members: 0,
    events: 0,
    since: 2019,
    page: "../html code/nature.html",
    team: ["President", "Vice President", "General SECRETARY", "Organizing Secretary"]
  }
];

let activeFilter = "all";


async function loadStats() {
  // Show loading pulse while fetching
  const memberEl = document.getElementById("stat-members");
  const eventEl  = document.getElementById("stat-events");
  if (memberEl) memberEl.classList.add("loading");
  if (eventEl)  eventEl.classList.add("loading");

  try {
    const res  = await fetch(`${BASE_URL}/api/public/stats`);
    const data = await res.json();

    if (memberEl) {
      memberEl.classList.remove("loading");
      // animate count up
      animateCount(memberEl, data.totalStudents || 0);
    }
    if (eventEl) {
      eventEl.classList.remove("loading");
      animateCount(eventEl, data.totalEvents || 0);
    }

  } catch (err) {
    // Server not running — show fallback numbers
    console.warn("Could not load stats from server:", err.message);
    if (memberEl) { memberEl.classList.remove("loading"); memberEl.textContent = "415+"; }
    if (eventEl)  { eventEl.classList.remove("loading");  eventEl.textContent  = "51+"; }
  }
}

// ── Smooth count-up animation ─────────────────
function animateCount(el, target) {
  const duration = 900;
  const start    = performance.now();
  const from     = 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


function renderClubs(list) {
  const grid = document.getElementById("clubs-grid");

  let html = list.map(c => `
    <div class="club-card">
      <div class="card-banner" style="background:linear-gradient(135deg,${c.color} 0%,${c.color}bb 100%)">
        <div class="card-dots"></div>
        <div class="card-icon-wrap">${c.icon}</div>
        <span class="card-badge">${c.tag}</span>
      </div>
      <div class="card-body">
        <span class="card-tag" style="color:${c.color};background:${c.color}18">${c.tag}</span>
        <h3 class="card-name">${c.name}</h3>
        <p class="card-desc">${c.desc}</p>
        <div class="card-stats">
          <div class="cs"><div class="cs-num">${c.members}</div><div class="cs-lbl">Members</div></div>
          <div class="cs"><div class="cs-num">${c.events}</div><div class="cs-lbl">Events/yr</div></div>
          <div class="cs"><div class="cs-num">${c.since}</div><div class="cs-lbl">Est.</div></div>
        </div>
        <div class="card-btns">
          <button class="btn-explore" onclick="openModal('${c.id}')">
            <i class="fa-solid fa-circle-info"></i> Explore
          </button>
          <button class="btn-join-card" style="background:${c.color}" onclick="window.location.href='${c.page}'">
            <i class="fa-solid fa-user-plus"></i> Join Club
          </button>
        </div>
      </div>
    </div>
  `).join("");

  // Propose card
  html += `
    <div class="propose-card" onclick="alert('Feature coming soon! Contact admin.')">
      <div class="propose-icon"><i class="fa-solid fa-plus"></i></div>
      <div class="propose-title">Propose a New Club</div>
      <div class="propose-sub">Have an idea? Submit your proposal to the admin team.</div>
    </div>
  `;

  grid.innerHTML = html;
}


function openModal(id) {
  const c = clubs.find(x => x.id === id);
  if (!c) return;

  document.getElementById("modal-banner").style.background =
    `linear-gradient(135deg,${c.color} 0%,${c.color}99 100%)`;
  document.getElementById("modal-icon").textContent = c.icon;

  const tag = document.getElementById("modal-tag");
  tag.textContent   = c.tag;
  tag.style.cssText = `color:${c.color};background:${c.color}18`;

  document.getElementById("modal-name").textContent    = c.name;
  document.getElementById("modal-desc").textContent    = c.desc;
  document.getElementById("modal-members").textContent = c.members;
  document.getElementById("modal-events").textContent  = c.events;
  document.getElementById("modal-since").textContent   = c.since;

  document.getElementById("modal-team").innerHTML =
    c.team.map(r => `<span class="role-chip">${r}</span>`).join("");

  const btn         = document.getElementById("modal-join-btn");
  btn.style.background = c.color;
  btn.onclick       = () => window.location.href = c.page;

  document.getElementById("club-modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("club-modal").classList.remove("active");
  document.body.style.overflow = "";
}


function applyFilters() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const filtered = clubs.filter(c => {
    const matchFilter = activeFilter === "all" || c.tag === activeFilter;
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.tag.toLowerCase().includes(q)  ||
      c.desc.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });
  renderClubs(filtered);
}

// ── Event Listeners ───────────────────────────
document.getElementById("filterBar").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  applyFilters();
});

document.getElementById("searchInput").addEventListener("input", applyFilters);

document.getElementById("close-modal").addEventListener("click", closeModal);

document.getElementById("club-modal").addEventListener("click", e => {
  if (e.target === document.getElementById("club-modal")) closeModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

// ── Init ──────────────────────────────────────
renderClubs(clubs);  // render cards first (instant)
loadStats();         // then fetch live stats from backend
