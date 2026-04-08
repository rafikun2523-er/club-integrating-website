// clubs.js — Clubs Page

const clubs = [
    {
        name: "Computer Society", icon: "💻", banner: "linear-gradient(135deg,#1a1d6e,#3a4fcf)", tag: "Technology", desc: "Programming contests, hackathons, and tech workshops for future engineers.", members: 120, events: 8, since: 2015,
        team: [{ init: "AR", name: "Anan Rahman", role: "President", bg: "#1a1d6e" }, { init: "SR", name: "Sakib Rahman", role: "Vice President", bg: "#3a4fcf" }, { init: "TH", name: "Tania Haque", role: "Secretary", bg: "#2B2E83" }, { init: "MK", name: "Mahim Khan", role: "Treasurer", bg: "#1a1d6e" }]
    },
    {
        name: "Debate Club", icon: "🎤", banner: "linear-gradient(135deg,#7b2d8b,#c0569e)", tag: "Public Speaking", desc: "Sharpen communication and critical thinking through competitive debates.", members: 80, events: 6, since: 2016,
        team: [{ init: "FI", name: "Farhana Islam", role: "President", bg: "#7b2d8b" }, { init: "RK", name: "Rafiq Khan", role: "Vice President", bg: "#c0569e" }, { init: "SN", name: "Sumi Noor", role: "Secretary", bg: "#7b2d8b" }, { init: "AH", name: "Arif Hossain", role: "Treasurer", bg: "#c0569e" }]
    },
    {
        name: "Cultural Club", icon: "🎭", banner: "linear-gradient(135deg,#b5410d,#e97b1a)", tag: "Arts & Culture", desc: "Celebrate traditions through drama, music, dance, and art festivals.", members: 95, events: 10, since: 2014,
        team: [{ init: "NJ", name: "Nusrat Jahan", role: "President", bg: "#b5410d" }, { init: "KA", name: "Karim Ahmed", role: "Vice President", bg: "#e97b1a" }, { init: "RP", name: "Rima Paul", role: "Secretary", bg: "#b5410d" }, { init: "SM", name: "Sabbir Mia", role: "Treasurer", bg: "#e97b1a" }]
    },
    {
        name: "Photography Club", icon: "📷", banner: "linear-gradient(135deg,#0f6e56,#1d9e75)", tag: "Creative Arts", desc: "Capture campus moments and develop photography and editing skills.", members: 60, events: 5, since: 2018,
        team: [{ init: "ZR", name: "Zahid Rahman", role: "President", bg: "#0f6e56" }, { init: "MH", name: "Munni Hasan", role: "Vice President", bg: "#1d9e75" }, { init: "AB", name: "Anis Barua", role: "Secretary", bg: "#0f6e56" }, { init: "TK", name: "Tisha Khatun", role: "Treasurer", bg: "#1d9e75" }]
    },
    {
        name: "Sports Club", icon: "⚽", banner: "linear-gradient(135deg,#7a1f1f,#c94a4a)", tag: "Sports & Fitness", desc: "Inter-university tournaments, fitness events, and team building activities.", members: 110, events: 12, since: 2013,
        team: [{ init: "JH", name: "Jahir Hossain", role: "President", bg: "#7a1f1f" }, { init: "RB", name: "Rina Begum", role: "Vice President", bg: "#c94a4a" }, { init: "FK", name: "Fazlul Karim", role: "Secretary", bg: "#7a1f1f" }, { init: "PA", name: "Puja Akter", role: "Treasurer", bg: "#c94a4a" }]
    }
];

function buildGrid() {
    const g = document.getElementById('clubs-grid');
    g.innerHTML = clubs.map((c, i) => `
    <div class="club-card" onclick="openModal(${i})">
      <div class="club-banner" style="background:${c.banner}">${c.icon}</div>
      <div class="club-body">
        <div class="club-name">${c.name}</div>
        <div class="club-desc">${c.desc}</div>
        <div class="club-meta">
          <span class="club-members">👤 ${c.members} Members</span>
          <button class="join-btn" onclick="event.stopPropagation()">Join Now</button>
        </div>
      </div>
    </div>
  `).join('') + `
    <div class="propose-card">
      <div class="propose-icon">➕</div>
      <div class="propose-title">Propose a New Club</div>
      <div class="propose-sub">Submit your idea to admin</div>
    </div>
  `;
}

function openModal(i) {
    const c = clubs[i];
    document.getElementById('modal-banner').style.background = c.banner;
    document.getElementById('modal-icon').textContent = c.icon;
    document.getElementById('modal-tag').textContent = c.tag;
    document.getElementById('modal-name').textContent = c.name;
    document.getElementById('modal-desc').textContent = c.desc;
    document.getElementById('modal-members').textContent = c.members;
    document.getElementById('modal-events').textContent = c.events;
    document.getElementById('modal-since').textContent = c.since;
    document.getElementById('modal-team').innerHTML = c.team.map(m => `
    <div class="team-member">
      <div class="team-avt" style="background:${m.bg}">${m.init}</div>
      <div class="team-info"><div class="name">${m.name}</div><div class="role">${m.role}</div></div>
    </div>
  `).join('');
    document.getElementById('club-modal').classList.add('open');
}

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('club-modal').classList.remove('open');
});
document.getElementById('club-modal').addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
});

buildGrid();
