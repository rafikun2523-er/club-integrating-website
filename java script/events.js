// =============================================
//  java script/events.js — Events Page
//  Live: upcoming + completed events from DB
// =============================================

const BASE_URL = window.location.hostname === "localhost" ||
                 window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;

let allEventsData = [];
const COLORS = ["#2B2E83","#1a5276","#a93226","#1e6b3c","#6c3483","#854F0B"];

async function loadEvents() {
  const container = document.getElementById("events-container");
  container.innerHTML = `<div style="text-align:center;padding:40px;color:#888">
    <i class="fa-solid fa-spinner fa-spin" style="font-size:24px"></i><br><br>Loading events...
  </div>`;

  try {
    const res = await fetch(`${BASE_URL}/api/public/events/all`);
    if (res.ok) {
      allEventsData = await res.json();
    }

    if (!allEventsData.length) {
      // static fallback
      allEventsData = [
        { _id:"1", title:"BAUET Hackathon 2026",             date:"2026-04-15", location:"Main Auditorium", status:"upcoming" },
        { _id:"2", title:"Inter-College Debate Championship", date:"2026-04-22", location:"Seminar Hall",    status:"upcoming" },
        { _id:"3", title:"Boisakhi Cultural Night",           date:"2026-04-30", location:"BAUET Ground",   status:"upcoming" },
      ];
    }

    renderEvents(allEventsData);
  } catch {
    allEventsData = [
      { _id:"1", title:"BAUET Hackathon 2026",             date:"2026-04-15", location:"Main Auditorium", status:"upcoming" },
      { _id:"2", title:"Inter-College Debate Championship", date:"2026-04-22", location:"Seminar Hall",    status:"upcoming" },
    ];
    renderEvents(allEventsData);
  }
}

function renderEvents(list) {
  const container = document.getElementById("events-container");
  if (!list.length) {
    container.innerHTML = '<div class="no-results" style="text-align:center;padding:32px;color:#888">No events found.</div>';
    return;
  }

  container.innerHTML = list.map((e, i) => {
    const d      = new Date(e.date);
    const day    = isNaN(d) ? "—" : d.getDate();
    const month  = isNaN(d) ? "—" : d.toLocaleString("en",{month:"short"}).toUpperCase();
    const color  = COLORS[i % COLORS.length];
    const isDone = e.status === "completed";

    return `
      <div class="event-item" onclick="showDetail('${e._id}')"
           style="cursor:pointer;transition:transform .2s,box-shadow .2s"
           onmouseover="this.style.transform='translateX(6px)'"
           onmouseout="this.style.transform=''">
        <div class="event-date" style="background:${color}">
          <div class="event-day">${day}</div>
          <div class="event-month">${month}</div>
        </div>
        <div class="event-info">
          <div class="event-name">${e.title}</div>
          <div class="event-club">
            <i class="fa-solid fa-location-dot"></i> ${e.location || "BAUET Campus"}
            ${e.description ? ` &nbsp;·&nbsp; ${e.description.slice(0,55)}${e.description.length>55?"…":""}` : ""}
          </div>
        </div>
        <span class="badge ${isDone ? "badge-completed" : "badge-open"}">
          ${isDone ? "✅ Completed" : "🟢 Upcoming"}
        </span>
      </div>`;
  }).join("");
}

// ── Event detail popup ────────────────────────
function showDetail(id) {
  const e = allEventsData.find(x => x._id === id);
  if (!e) return;

  const d    = new Date(e.date);
  const date = isNaN(d) ? "—" : d.toLocaleDateString("en-BD",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const isDone = e.status === "completed";

  let modal = document.getElementById("evDetailModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "evDetailModal";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;overflow:hidden;
                box-shadow:0 24px 64px rgba(0,0,0,0.2);animation:popIn .3s ease">
      <div style="background:linear-gradient(135deg,#2B2E83,#5b6ef5);padding:32px 28px 24px;color:#fff">
        <div style="font-size:11px;opacity:.75;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">
          ${isDone ? "✅ Completed Event" : "🟢 Upcoming Event"}
        </div>
        <h2 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:800;
                   margin-bottom:12px;line-height:1.3">${e.title}</h2>
        <div style="font-size:13px;opacity:.8"><i class="fa-solid fa-calendar"></i> ${date}</div>
      </div>
      <div style="padding:24px 28px">
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
          <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:#444">
            <i class="fa-solid fa-location-dot" style="color:#2B2E83;width:16px"></i>
            ${e.location || "BAUET Campus"}
          </div>
          ${e.description ? `
          <div style="display:flex;align-items:flex-start;gap:10px;font-size:14px;color:#555;line-height:1.65">
            <i class="fa-solid fa-circle-info" style="color:#2B2E83;width:16px;margin-top:2px"></i>
            ${e.description}
          </div>` : ""}
        </div>
        <button onclick="document.getElementById('evDetailModal').remove()"
          style="width:100%;padding:13px;background:#2B2E83;color:#fff;border:none;
                 border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">
          Close
        </button>
      </div>
    </div>`;
  modal.onclick = ev => { if (ev.target === modal) modal.remove(); };
}

// ── Filter ────────────────────────────────────
function filterEvents() {
  const search = (document.getElementById("search-input")?.value || "").toLowerCase();
  const status = document.getElementById("status-filter")?.value || "";
  const filtered = allEventsData.filter(e => {
    const ms = e.title.toLowerCase().includes(search) ||
               (e.location||"").toLowerCase().includes(search) ||
               (e.description||"").toLowerCase().includes(search);
    const mv = !status || e.status === status;
    return ms && mv;
  });
  renderEvents(filtered);
}

// animation style
const s = document.createElement("style");
s.textContent = `
  @keyframes popIn{from{opacity:0;transform:scale(.95) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
  .badge-completed{background:#eafaf1;color:#1e8449}
  .badge-open{background:#eef5ff;color:#2B2E83}
`;
document.head.appendChild(s);

loadEvents();
