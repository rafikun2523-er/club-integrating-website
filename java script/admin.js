// =============================================
//  java script/admin.js
//  admin-guard.js এর পরে load হয়
//  adminFetch() function admin-guard.js থেকে আসে
// =============================================

const BASE_URL_ADMIN = window.location.hostname === "localhost" ||
                       window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;

let allStudents = [];
let allEvents   = [];

// ── Toast ─────────────────────────────────────
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className   = `toast show ${type}`;
  setTimeout(() => { t.className = "toast"; }, 3000);
}

// ── Tab switching ─────────────────────────────
function switchTab(name) {
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".sidebar-link").forEach(l => l.classList.remove("active"));
  document.getElementById(`tab-${name}`)?.classList.add("active");
  document.querySelector(`[data-tab="${name}"]`)?.classList.add("active");
  if (name === "events")   loadEvents();
  if (name === "notices")  loadNotices();
  if (name === "students") loadStudents();
}

// ── Modal ─────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }

document.addEventListener("DOMContentLoaded", () => {

  // modal overlay click to close
  document.querySelectorAll(".modal-overlay").forEach(el => {
    el.addEventListener("click", e => {
      if (e.target === el) el.classList.remove("open");
    });
  });

  // admin name (set by admin-guard.js already, but backup here)
  const name = localStorage.getItem("adminName") || "Admin";
  ["adminWelcomeName","welcomeNameBig"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = name;
  });
  const av = document.getElementById("adminAvatar");
  if (av) av.textContent = name[0].toUpperCase();

  loadDashboard();
});

// ── authFetch wrapper (uses adminFetch from guard) ──
function af(url, options = {}) {
  // adminFetch is defined in admin-guard.js
  if (typeof adminFetch === "function") {
    return adminFetch(url, options);
  }
  // fallback
  const token = localStorage.getItem("adminToken");
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
      ...(options.headers || {})
    }
  });
}

// =============================================
//  DASHBOARD
// =============================================
async function loadDashboard() {
  try {
    const res  = await af(`${BASE_URL_ADMIN}/api/admin/stats`);
    if (!res.ok) { showToast("Session expired. Please login again.", "error"); return; }
    const data = await res.json();

    const set = (id, val) => { const el=document.getElementById(id); if(el) el.textContent=val??'—'; };
    set("stat-students", data.totalStudents);
    set("stat-clubs",    data.totalClubs ?? 5);
    set("stat-events",   data.totalEvents);
    set("stat-notices",  data.totalNotices);

    // Recent students
    const rsList = document.getElementById("recentStudents");
    if (rsList) {
      rsList.innerHTML = (data.recentStudents?.length)
        ? data.recentStudents.map(s => `
            <div class="dash-row">
              <div class="dash-row-avatar">${s.name[0]}</div>
              <div class="dash-row-info">
                <div class="dash-row-name">${s.name}</div>
                <div class="dash-row-sub">${s.department} · Batch ${s.batch}</div>
              </div>
            </div>`).join("")
        : '<div class="dash-row"><span style="color:var(--muted);font-size:13px;padding:8px">No students yet</span></div>';
    }

    // Recent events
    const reList = document.getElementById("recentEvents");
    if (reList) {
      reList.innerHTML = (data.recentEvents?.length)
        ? data.recentEvents.map(e => `
            <div class="dash-row">
              <div class="dash-row-info">
                <div class="dash-row-name">${e.title}</div>
                <div class="dash-row-sub">${new Date(e.date).toLocaleDateString("en-BD",{day:"numeric",month:"short",year:"numeric"})}</div>
              </div>
              <span class="dash-row-badge badge-${e.status}">${e.status}</span>
            </div>`).join("")
        : '<div class="dash-row"><span style="color:var(--muted);font-size:13px;padding:8px">No events yet</span></div>';
    }

  } catch (err) {
    console.error("Dashboard error:", err);
    showToast("Could not load dashboard data.", "error");
  }
}

// =============================================
//  EVENTS
// =============================================
async function loadEvents() {
  const tbody = document.getElementById("eventsBody");
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" class="loading-row"><i class="fa fa-spinner fa-spin"></i> Loading...</td></tr>';

  try {
    const res = await af(`${BASE_URL_ADMIN}/api/admin/events`);
    allEvents = await res.json();

    if (!allEvents.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="loading-row">No events yet. Add your first event!</td></tr>';
      return;
    }

    tbody.innerHTML = allEvents.map(e => `
      <tr>
        <td><strong>${e.title}</strong></td>
        <td>${new Date(e.date).toLocaleDateString("en-BD",{day:"numeric",month:"short",year:"numeric"})}</td>
        <td>${e.location || "—"}</td>
        <td><span class="status-badge badge-${e.status}">${e.status}</span></td>
        <td>
          <button class="btn-icon edit"    onclick="editEvent('${e._id}')"     title="Edit"><i class="fa fa-edit"></i></button>
          ${e.status==="upcoming"
            ? `<button class="btn-icon complete" onclick="completeEvent('${e._id}')" title="Mark complete"><i class="fa fa-check"></i></button>`
            : ""}
          <button class="btn-icon delete"  onclick="deleteEvent('${e._id}')"   title="Delete"><i class="fa fa-trash"></i></button>
        </td>
      </tr>`).join("");

  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" class="loading-row">Error loading events.</td></tr>';
    console.error(err);
  }
}

function openEventModal() {
  ["eventId","eventTitle","eventDesc","eventDate","eventLocation"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const s = document.getElementById("eventStatus");
  if (s) s.value = "upcoming";
  const t = document.getElementById("eventModalTitle");
  if (t) t.textContent = "Add Event";
  openModal("eventModal");
}

function editEvent(id) {
  const ev = allEvents.find(e => e._id === id);
  if (!ev) return;
  document.getElementById("eventId").value        = ev._id;
  document.getElementById("eventTitle").value     = ev.title;
  document.getElementById("eventDesc").value      = ev.description || "";
  document.getElementById("eventDate").value      = ev.date ? ev.date.split("T")[0] : "";
  document.getElementById("eventLocation").value  = ev.location || "";
  document.getElementById("eventStatus").value    = ev.status;
  const t = document.getElementById("eventModalTitle");
  if (t) t.textContent = "Edit Event";
  openModal("eventModal");
}

async function saveEvent() {
  const id       = document.getElementById("eventId")?.value;
  const title    = document.getElementById("eventTitle")?.value.trim();
  const desc     = document.getElementById("eventDesc")?.value.trim();
  const date     = document.getElementById("eventDate")?.value;
  const location = document.getElementById("eventLocation")?.value.trim();
  const status   = document.getElementById("eventStatus")?.value;

  if (!title || !date) { showToast("Title and date are required!", "error"); return; }

  const url    = id ? `${BASE_URL_ADMIN}/api/admin/events/${id}` : `${BASE_URL_ADMIN}/api/admin/events`;
  const method = id ? "PUT" : "POST";

  try {
    const res  = await af(url, { method, body: JSON.stringify({ title, description:desc, date, location, status }) });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || "Error!", "error"); return; }
    closeModal("eventModal");
    showToast(id ? "✅ Event updated!" : "✅ Event created!", "success");
    loadEvents();
    loadDashboard();
  } catch (err) {
    showToast("Server error!", "error");
    console.error(err);
  }
}

async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;
  try {
    await af(`${BASE_URL_ADMIN}/api/admin/events/${id}`, { method: "DELETE" });
    showToast("Event deleted.", "success");
    loadEvents();
    loadDashboard();
  } catch (err) { showToast("Error!", "error"); }
}

async function completeEvent(id) {
  if (!confirm("Mark this event as completed? Participants will be finalized.")) return;
  try {
    const res  = await af(`${BASE_URL_ADMIN}/api/admin/events/${id}/complete`, { method: "POST" });
    const data = await res.json();
    showToast(data.message || "✅ Event completed!", "success");
    loadEvents();
    loadDashboard();
  } catch (err) { showToast("Error!", "error"); }
}

// =============================================
//  NOTICES
// =============================================
async function loadNotices() {
  const grid = document.getElementById("noticesList");
  if (!grid) return;
  grid.innerHTML = '<div style="color:var(--muted);padding:24px;font-size:13px"><i class="fa fa-spinner fa-spin"></i> Loading...</div>';

  try {
    const res     = await fetch(`${BASE_URL_ADMIN}/api/notices`);
    const notices = await res.json();

    if (!notices.length) {
      grid.innerHTML = '<div style="color:var(--muted);padding:24px;font-size:13px">No notices yet. Post the first one!</div>';
      return;
    }

    grid.innerHTML = notices.map(n => `
      <div class="notice-card ${n.category}">
        <div class="notice-card-top">
          <div class="notice-title">${n.title}</div>
          <button class="btn-icon delete" onclick="deleteNotice('${n._id}')"><i class="fa fa-times"></i></button>
        </div>
        <p class="notice-text">${n.text}</p>
        <div class="notice-meta">
          <span class="notice-tag ${n.category}">${n.category}</span>
          <span>${new Date(n.createdAt).toLocaleDateString("en-BD",{day:"numeric",month:"short",year:"numeric"})}</span>
        </div>
      </div>`).join("");

  } catch (err) {
    grid.innerHTML = '<div style="color:var(--muted);padding:24px;font-size:13px">Error loading notices.</div>';
    console.error(err);
  }
}

function openNoticeModal() {
  ["noticeTitle","noticeText"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const c = document.getElementById("noticeCategory");
  if (c) c.value = "general";
  openModal("noticeModal");
}

async function saveNotice() {
  const title    = document.getElementById("noticeTitle")?.value.trim();
  const text     = document.getElementById("noticeText")?.value.trim();
  const category = document.getElementById("noticeCategory")?.value;

  if (!title || !text) { showToast("Title and message are required!", "error"); return; }

  try {
    const res  = await af(`${BASE_URL_ADMIN}/api/admin/notices`, {
      method: "POST",
      body: JSON.stringify({ title, text, category })
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.message || "Error!", "error"); return; }
    closeModal("noticeModal");
    showToast("✅ Notice published!", "success");
    loadNotices();
    loadDashboard();
  } catch (err) { showToast("Server error!", "error"); }
}

async function deleteNotice(id) {
  if (!confirm("Delete this notice?")) return;
  try {
    await af(`${BASE_URL_ADMIN}/api/admin/notices/${id}`, { method: "DELETE" });
    showToast("Notice deleted.", "success");
    loadNotices();
    loadDashboard();
  } catch (err) { showToast("Error!", "error"); }
}

// =============================================
//  STUDENTS
// =============================================
async function loadStudents() {
  const tbody = document.getElementById("studentsBody");
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="loading-row"><i class="fa fa-spinner fa-spin"></i> Loading...</td></tr>';

  try {
    const res   = await af(`${BASE_URL_ADMIN}/api/admin/students`);
    allStudents = await res.json();
    renderStudents(allStudents);
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Error loading students.</td></tr>';
    console.error(err);
  }
}

function renderStudents(list) {
  const tbody = document.getElementById("studentsBody");
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No registered students yet.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(s => `
    <tr>
      <td>
        ${s.photo
          ? `<img src="${BASE_URL_ADMIN}${s.photo}" class="student-photo" alt="${s.name}" onerror="this.style.display='none'">`
          : `<div class="student-initials">${s.name[0]}</div>`}
      </td>
      <td><strong>${s.name}</strong></td>
      <td style="font-family:monospace;font-size:12px">${s.studentID}</td>
      <td>${s.department}</td>
      <td>${s.batch}</td>
      <td style="font-size:12px;color:var(--muted)">${s.email}</td>
      <td>
        <button class="btn-icon delete" onclick="deleteStudent('${s.studentID}','${s.name.replace(/'/g,"\\'")}')">
          <i class="fa fa-user-minus"></i>
        </button>
      </td>
    </tr>`).join("");
}

function filterStudents() {
  const q = (document.getElementById("studentSearch")?.value || "").toLowerCase();
  renderStudents(allStudents.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.studentID.toLowerCase().includes(q) ||
    (s.department||"").toLowerCase().includes(q)
  ));
}

async function deleteStudent(studentID, name) {
  if (!confirm(`Remove ${name} from the system?`)) return;
  try {
    const res  = await af(`${BASE_URL_ADMIN}/api/admin/students/${studentID}`, { method: "DELETE" });
    const data = await res.json();
    showToast(data.message || "Student removed.", "success");
    loadStudents();
    loadDashboard();
  } catch (err) { showToast("Error!", "error"); }
}
