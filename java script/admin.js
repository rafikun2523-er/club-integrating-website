const BASE_URL_ADMIN = window.location.hostname === "localhost" ||
                       window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000"
  : ``;

let allStudents = [];
let allEvents   = [];


function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.className   = `toast show ${type}`;
  setTimeout(() => { t.className = "toast"; }, 3000);
}


function switchTab(name) {
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".sidebar-link").forEach(l => l.classList.remove("active"));
  document.getElementById(`tab-${name}`)?.classList.add("active");
  document.querySelector(`[data-tab="${name}"]`)?.classList.add("active");
  if (name === "events")   loadEvents();
  if (name === "notices")  loadNotices();
  if (name === "students") loadStudents();
}


function openModal(id)  { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }

document.addEventListener("DOMContentLoaded", () => {


  document.querySelectorAll(".modal-overlay").forEach(el => {
    el.addEventListener("click", e => {
      if (e.target === el) el.classList.remove("open");
    });
  });


  const name = localStorage.getItem("adminName") || "Admin";
  ["adminWelcomeName","welcomeNameBig"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = name;
  });
  const av = document.getElementById("adminAvatar");
  if (av) av.textContent = name[0].toUpperCase();

  loadDashboard();
});


function af(url, options = {}) {
  // adminFetch is defined in admin-guard.js
  if (typeof adminFetch === "function") {
    return adminFetch(url, options);
  }

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





let allRegistrations = [];


async function loadRegistrations() {

  try {
    const res = await fetch(`${BASE_URL}/api/admin/event-registrations`, {
      headers: { Authorization: 'Bearer ' + (localStorage.getItem('adminToken') || '') }
    });
    if (res.ok) {
      allRegistrations = await res.json();
      renderRegistrations(allRegistrations);
      updateRegBadge();
      return;
    }
  } catch (_) {}


  allRegistrations = JSON.parse(localStorage.getItem('bauet_registrations') || '[]');
  renderRegistrations(allRegistrations);
  updateRegBadge();
}

function updateRegBadge() {
  const pending = allRegistrations.filter(r => r.status === 'pending').length;
  const badge = document.getElementById('pendingRegCount');
  if (badge) {
    badge.textContent = pending;
    badge.style.display = pending > 0 ? 'inline' : 'none';
  }
}

function renderRegistrations(list) {
  const tbody = document.getElementById('registrationsBody');
  if (!tbody) return;
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#aaa;padding:30px">No registrations yet.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(r => {
    const statusStyle = {
      pending:  'background:#fff3cd;color:#856404',
      approved: 'background:#d1e7dd;color:#0f5132',
      rejected: 'background:#f8d7da;color:#842029'
    }[r.status] || '';
    const statusLabel = { pending:'⏳ Pending', approved:'✅ Approved', rejected:'❌ Rejected' }[r.status] || r.status;
    const payLabel = r.payMethod === 'cash'
      ? '💵 Cash'
      : `${r.payMethod.charAt(0).toUpperCase()+r.payMethod.slice(1)} — ${r.txnId}`;
    const date = new Date(r.submittedAt).toLocaleDateString('en-BD',{day:'numeric',month:'short',year:'numeric'});

    return `<tr>
      <td style="font-size:11px;color:#999">${r.refId || r.id || '—'}</td>
      <td>
        <div style="font-weight:600;color:#1a1d6e">${r.name}</div>
        <div style="font-size:11px;color:#888">${r.studentId} · ${r.email}</div>
        <div style="font-size:11px;color:#888">📞 ${r.phone}</div>
      </td>
      <td>
        <div style="font-weight:500">${r.eventTitle}</div>
        <div style="font-size:11px;color:#999">${date}</div>
      </td>
      <td>${r.department} / ${r.batch}</td>
      <td style="font-size:12px">${payLabel}<br><span style="color:#888;font-size:11px">Fee: ৳${r.fee}</span></td>
      <td><span style="padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;${statusStyle}">${statusLabel}</span></td>
      <td>
        ${r.status === 'pending' ? `
          <button onclick="updateRegStatus('${r.refId || r.id}','approved')"
            style="background:#1e8449;color:#fff;border:none;border-radius:6px;padding:5px 10px;
                   font-size:12px;cursor:pointer;margin-right:4px">✅ Approve</button>
          <button onclick="updateRegStatus('${r.refId || r.id}','rejected')"
            style="background:#e74c3c;color:#fff;border:none;border-radius:6px;padding:5px 10px;
                   font-size:12px;cursor:pointer">❌ Reject</button>
        ` : `<span style="color:#999;font-size:12px">—</span>`}
      </td>
    </tr>`;
  }).join('');
}

function filterRegistrations() {
  const status = document.getElementById('regStatusFilter')?.value || '';
  const search = (document.getElementById('regSearchInput')?.value || '').toLowerCase();
  const filtered = allRegistrations.filter(r => {
    const ms = r.name.toLowerCase().includes(search) ||
               r.eventTitle.toLowerCase().includes(search) ||
               r.studentId.toLowerCase().includes(search);
    const mv = !status || r.status === status;
    return ms && mv;
  });
  renderRegistrations(filtered);
}

async function updateRegStatus(regId, newStatus) {
  // Try backend
  try {
    const res = await fetch(`${BASE_URL}/api/admin/event-registrations/${regId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (localStorage.getItem('adminToken') || '')
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) { loadRegistrations(); return; }
  } catch (_) {}

 
  const regs = JSON.parse(localStorage.getItem('bauet_registrations') || '[]');
  const idx = regs.findIndex(r => (r.refId || r.id) === regId);
  if (idx !== -1) {
    regs[idx].status = newStatus;
    localStorage.setItem('bauet_registrations', JSON.stringify(regs));
  }
  allRegistrations = regs;
  renderRegistrations(allRegistrations);
  updateRegBadge();
  const toastMsg = newStatus === 'approved'
    ? '✅ Registration Approved!'
    : '❌ Registration Rejected!';
  const toastType = newStatus === 'approved' ? 'success' : 'error';
  showToast(toastMsg, toastType);
}


const _origSwitchTab = typeof switchTab === 'function' ? switchTab : null;
if (typeof switchTab !== 'undefined') {
  const __origSwitch = switchTab;
  switchTab = function(tab) {
    __origSwitch(tab);
    if (tab === 'registrations') loadRegistrations();
  };
}


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(loadRegistrations, 800);
});
