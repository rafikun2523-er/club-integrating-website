// =============================================
//  java script/index.js — Home Page
// =============================================

const BASE_URL = window.location.hostname === "localhost" ||
                 window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;

const COLORS = ["#2B2E83","#1a5276","#a93226","#1e6b3c","#6c3483"];
const CAT = {
  general:     { bg:"#eef0ff", color:"#2B2E83", dot:"#2B2E83", icon:"fa-bullhorn" },
  event:       { bg:"#fff5e6", color:"#e67e22", dot:"#e67e22", icon:"fa-calendar-check" },
  urgent:      { bg:"#fdf2f2", color:"#e74c3c", dot:"#e74c3c", icon:"fa-exclamation-circle" },
  achievement: { bg:"#eafaf1", color:"#1e8449", dot:"#1e8449", icon:"fa-trophy" }
};

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff/60000), h = Math.floor(m/60), day = Math.floor(h/24);
  if (day > 0) return `${day}d ago`;
  if (h > 0)   return `${h}h ago`;
  if (m > 0)   return `${m}m ago`;
  return "Just now";
}

function animCount(el, target) {
  if (!el) return;
  el.textContent = "0+";
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur.toLocaleString() + "+";
    if (cur >= target) clearInterval(t);
  }, 28);
}

// ── Notice detail popup ───────────────────────
function showNoticeDetail(title, text, category, date, postedBy) {
  const c  = CAT[category] || CAT.general;
  const dt = new Date(date).toLocaleDateString("en-BD", {
    weekday:"long", day:"numeric", month:"long", year:"numeric"
  });
  let modal = document.getElementById("noticeDetailModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "noticeDetailModal";
    modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;overflow:hidden;
                box-shadow:0 24px 64px rgba(0,0,0,0.2);animation:popIn .3s ease">
      <div style="background:${c.bg};padding:28px 28px 20px;border-left:5px solid ${c.color}">
        <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
                     color:${c.color};background:${c.color}20;padding:3px 10px;border-radius:20px">
          ${category}
        </span>
        <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:800;
                   margin-top:10px;color:#1a1a2e;line-height:1.3">${title}</h2>
      </div>
      <div style="padding:24px 28px">
        <p style="font-size:14px;color:#444;line-height:1.75;margin-bottom:18px">${text}</p>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#999;
                    padding-top:12px;border-top:1px solid #eee">
          <span>📌 Posted by: ${postedBy || "Admin"}</span>
          <span>📅 ${dt}</span>
        </div>
        <button onclick="document.getElementById('noticeDetailModal').remove()"
          style="margin-top:18px;width:100%;padding:13px;background:#2B2E83;color:#fff;
                 border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;
                 transition:background .2s"
          onmouseover="this.style.background='#5b6ef5'"
          onmouseout="this.style.background='#2B2E83'">
          Close
        </button>
      </div>
    </div>`;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
}

// ── Live stats from DB ────────────────────────
async function loadStats() {
  try {
    const res  = await fetch(`${BASE_URL}/api/public/stats`);
    const data = await res.json();
    animCount(document.getElementById("stat-members"), data.totalStudents || 0);
    animCount(document.getElementById("stat-events"),  data.totalEvents   || 0);
    animCount(document.getElementById("stat-clubs"),   data.totalClubs    || 5);
  } catch {
    // static fallback
    animCount(document.getElementById("stat-members"), 500);
    animCount(document.getElementById("stat-events"),  51);
    animCount(document.getElementById("stat-clubs"),   5);
  }
}

// ── Upcoming events — only upcoming status ────
async function loadEvents() {
  const list = document.getElementById("homeEventsList");
  if (!list) return;
  try {
    const res    = await fetch(`${BASE_URL}/api/public/events`);
    const events = await res.json();

    if (!events.length) {
      list.innerHTML = `<div style="text-align:center;padding:32px;color:#888">
        No upcoming events right now. Check back soon!
      </div>`;
      return;
    }

    list.innerHTML = events.map((e, i) => {
      const d   = new Date(e.date);
      const day = d.getDate();
      const mon = d.toLocaleString("en", { month:"short" }).toUpperCase();
      return `
        <div class="event-item">
          <div class="event-date" style="background:${COLORS[i % COLORS.length]}">
            <div class="event-day">${day}</div>
            <div class="event-month">${mon}</div>
          </div>
          <div class="event-info">
            <div class="event-name">${e.title}</div>
            <div class="event-meta">
              <i class="fa-solid fa-location-dot"></i> ${e.location || "BAUET Campus"}
              ${e.description ? ` &nbsp;·&nbsp; ${e.description.slice(0,50)}${e.description.length>50?"…":""}` : ""}
            </div>
          </div>
          <span class="badge badge-open"><i class="fa-solid fa-circle"></i> Open</span>
        </div>`;
    }).join("");
  } catch {
    // keep static HTML already in page
  }
}

// ── Notices → announcements + notifications ───
async function loadNotices() {
  try {
    const res     = await fetch(`${BASE_URL}/api/notices`);
    const notices = await res.json();
    if (!notices.length) return;

    // ── Announcements ──
    const aList = document.getElementById("homeAnnounceList");
    if (aList) {
      aList.innerHTML = notices.slice(0, 5).map(n => {
        const c  = CAT[n.category] || CAT.general;
        const dt = new Date(n.createdAt).toLocaleDateString("en-BD", {
          day:"numeric", month:"short", year:"numeric"
        });
        // safe encode for onclick
        const safeTitle = n.title.replace(/\\/g,"\\\\").replace(/'/g,"\\'");
        const safeText  = n.text.replace(/\\/g,"\\\\").replace(/'/g,"\\'");
        const safeBy    = (n.postedBy||"Admin").replace(/'/g,"\\'");
        return `
          <div class="announce-item"
               onclick="showNoticeDetail('${safeTitle}','${safeText}','${n.category}','${n.createdAt}','${safeBy}')"
               style="cursor:pointer;transition:background .15s"
               onmouseover="this.style.background='#f7f8ff'"
               onmouseout="this.style.background=''">
            <div class="announce-dot" style="background:${c.dot}"></div>
            <div class="announce-body">
              <div class="announce-title">${n.title}</div>
              <div class="announce-meta">${n.postedBy || "Admin"} &nbsp;·&nbsp; ${dt}</div>
            </div>
            <span class="announce-badge" style="color:${c.color};background:${c.bg}">${n.category}</span>
          </div>`;
      }).join("");
    }

    // ── Notifications ──
    const nList = document.getElementById("homeNotifList");
    if (nList) {
      nList.innerHTML = notices.slice(0, 4).map(n => {
        const c = CAT[n.category] || CAT.general;
        const safeTitle = n.title.replace(/\\/g,"\\\\").replace(/'/g,"\\'");
        const safeText  = n.text.replace(/\\/g,"\\\\").replace(/'/g,"\\'");
        const safeBy    = (n.postedBy||"Admin").replace(/'/g,"\\'");
        return `
          <div class="notif-item"
               onclick="showNoticeDetail('${safeTitle}','${safeText}','${n.category}','${n.createdAt}','${safeBy}')"
               style="cursor:pointer;transition:background .15s"
               onmouseover="this.style.background='#f7f8ff'"
               onmouseout="this.style.background=''">
            <div class="notif-icon" style="background:${c.bg};color:${c.color}">
              <i class="fa-solid ${c.icon}"></i>
            </div>
            <div class="notif-text">
              <strong>${n.title}</strong> — ${n.text.slice(0,80)}${n.text.length>80?"…":""}
            </div>
            <div class="notif-time">${timeAgo(n.createdAt)}</div>
          </div>`;
      }).join("");
    }
  } catch {
    // keep static HTML
  }
}

// ── Navbar + UI ───────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const navbar     = document.getElementById("navbar");
  const scrollBtn  = document.getElementById("scrollTop");
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 20);
    scrollBtn?.classList.toggle("show",  window.scrollY > 300);
  });

  hamburger?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("open");
    hamburger.classList.toggle("active");
  });
  mobileMenu?.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger?.classList.remove("active");
    })
  );

  scrollBtn?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const t = document.querySelector(a.getAttribute("href"));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior:"smooth", block:"start" }); }
    });
  });

  // Fade-in animation
  const style = document.createElement("style");
  style.textContent = `
    .feat-card,.event-item,.achieve-card,.announce-item,.notif-item{
      opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease}
    .feat-card.vis,.event-item.vis,.achieve-card.vis,.announce-item.vis,.notif-item.vis{
      opacity:1!important;transform:none!important}
    @keyframes popIn{from{opacity:0;transform:scale(.95) translateY(16px)}
                     to{opacity:1;transform:scale(1) translateY(0)}}
  `;
  document.head.appendChild(style);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const idx = [...en.target.parentElement.children].indexOf(en.target);
        en.target.style.transitionDelay = `${idx * 55}ms`;
        en.target.classList.add("vis");
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".feat-card,.achieve-card").forEach(el => obs.observe(el));

  // Load all live data
  loadStats();
  loadEvents();
  loadNotices();
});
