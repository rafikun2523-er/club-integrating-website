// admin.js — Admin Page

let members = [
    { name: "Tahsina Tasnim", id: "2101001", dept: "CSE", joined: "Jan 2026", status: "Active" },
    { name: "Sakib Rahman", id: "2101002", dept: "EEE", joined: "Jan 2026", status: "Active" },
    { name: "Raisa Akter", id: "2101003", dept: "CSE", joined: "Feb 2026", status: "Active" },
    { name: "Mehedi Hasan", id: "2101004", dept: "CE", joined: "Feb 2026", status: "Active" },
    { name: "Sadia Islam", id: "2101005", dept: "CSE", joined: "Mar 2026", status: "Inactive" },
    { name: "Tanvir Ahmed", id: "2101006", dept: "ME", joined: "Mar 2026", status: "Active" },
];
let approvals = [
    { name: "Farhan Ahmed", id: "2201001", dept: "CSE", date: "7 Apr 2026" },
    { name: "Nusrat Jahan", id: "2201002", dept: "EEE", date: "6 Apr 2026" },
    { name: "Mehedi Islam", id: "2201003", dept: "CE", date: "5 Apr 2026" },
    { name: "Puja Rani", id: "2201004", dept: "CSE", date: "4 Apr 2026" },
    { name: "Sabbir Hossain", id: "2201005", dept: "ME", date: "3 Apr 2026" },
];
let eventsData = [
    { name: "Programming Contest", date: "2026-06-20", venue: "Main Lab", status: "Upcoming" },
    { name: "Mind Storm 2026", date: "2026-07-10", venue: "Auditorium", status: "Registration Open" },
];

// Panel switching
function switchPanel(p) {
    document.querySelectorAll('.a-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
    document.getElementById('panel-' + p).classList.add('active');
    const sb = document.getElementById('sb-' + p);
    if (sb) sb.classList.add('active');
    if (p === 'members') renderMembers(members);
    if (p === 'approvals') renderApprovals();
    if (p === 'events') renderEvents();
}

// Members
function renderMembers(list) {
    document.getElementById('members-tbody').innerHTML = list.map((m, i) => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:7px;"><div class="avt" style="background:${i % 2 === 0 ? '#2B2E83' : '#3a4fcf'}">${m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>${m.name}</div></td>
      <td style="color:#999;">${m.id}</td>
      <td><span class="db">${m.dept}</span></td>
      <td style="color:#999;">${m.joined}</td>
      <td><span style="font-size:10px;padding:3px 9px;border-radius:10px;background:${m.status === 'Active' ? '#e8fff3' : '#fff0f0'};color:${m.status === 'Active' ? '#1a7a4a' : '#c0392b'};">${m.status}</span></td>
      <td><button class="abtn red" onclick="removeMember(${i})">Remove</button></td>
    </tr>
  `).join('');
}
function filterMembers(v) { renderMembers(members.filter(m => m.name.toLowerCase().includes(v.toLowerCase()) || m.id.includes(v))); }
function filterDept(d) { renderMembers(d ? members.filter(m => m.dept === d) : members); }
function removeMember(i) { members.splice(i, 1); renderMembers(members); toast('Member removed.'); }

// Approvals
function renderApprovals() {
    const el = document.getElementById('approvals-list');
    if (!approvals.length) { el.innerHTML = '<div style="text-align:center;color:#aaa;padding:24px;font-size:13px;">No pending requests.</div>'; return; }
    el.innerHTML = approvals.map((a, i) => `
    <div class="approval-row">
      <div class="avt" style="width:36px;height:36px;font-size:11px;">${a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
      <div class="apv-info"><div class="apv-name">${a.name}</div><div class="apv-meta">${a.id} · ${a.dept} · ${a.date}</div></div>
      <div style="display:flex;gap:6px;">
        <button class="abtn green" onclick="approveOne(${i})">Approve</button>
        <button class="abtn red"   onclick="rejectOne(${i})">Reject</button>
      </div>
    </div>
  `).join('');
}
function approveOne(i) { const a = approvals[i]; members.unshift({ name: a.name, id: a.id, dept: a.dept, joined: 'Apr 2026', status: 'Active' }); approvals.splice(i, 1); renderApprovals(); updateBadge(); toast(a.name + ' approved!'); }
function rejectOne(i) { const n = approvals[i].name; approvals.splice(i, 1); renderApprovals(); updateBadge(); toast(n + ' rejected.'); }
function approveAll() { while (approvals.length) { const a = approvals.shift(); members.unshift({ name: a.name, id: a.id, dept: a.dept, joined: 'Apr 2026', status: 'Active' }); } renderApprovals(); updateBadge(); toast('All approved!'); }
function rejectAll() { approvals = []; renderApprovals(); updateBadge(); toast('All rejected.'); }
function updateBadge() { document.getElementById('approval-badge').textContent = approvals.length; }

// Events
function renderEvents() {
    document.getElementById('events-tbody').innerHTML = eventsData.map((e, i) => `
    <tr>
      <td style="font-weight:500;color:#1a1d6e;">${e.name}</td>
      <td style="color:#999;">${e.date}</td>
      <td style="color:#666;">${e.venue}</td>
      <td><span style="font-size:10px;padding:3px 9px;border-radius:10px;background:${e.status === 'Registration Open' ? '#e8fff3' : '#e8f4ff'};color:${e.status === 'Registration Open' ? '#1a7a4a' : '#1a4a8a'};">${e.status}</span></td>
      <td><div style="display:flex;gap:6px;"><button class="abtn light">Edit</button><button class="abtn red" onclick="removeEvent(${i})">Delete</button></div></td>
    </tr>
  `).join('');
}
function removeEvent(i) { eventsData.splice(i, 1); renderEvents(); toast('Event deleted.'); }
function addEvent() {
    const n = document.getElementById('ev-name').value, d = document.getElementById('ev-date').value, v = document.getElementById('ev-venue').value, s = document.getElementById('ev-status').value;
    if (!n || !d) { toast('Please fill all fields.'); return; }
    eventsData.push({ name: n, date: d, venue: v || 'TBD', status: s }); renderEvents(); closeMod('event-modal'); toast('Event added!');
    document.getElementById('ev-name').value = ''; document.getElementById('ev-date').value = ''; document.getElementById('ev-venue').value = '';
}

// Add member
function addMember() {
    const n = document.getElementById('mem-name').value, id = document.getElementById('mem-id').value, d = document.getElementById('mem-dept').value;
    if (!n || !id) { toast('Please fill all fields.'); return; }
    members.unshift({ name: n, id: id, dept: d, joined: 'Apr 2026', status: 'Active' }); renderMembers(members); closeMod('member-modal'); toast('Member added!');
    document.getElementById('mem-name').value = ''; document.getElementById('mem-id').value = '';
}

// Add achievement
function addAchievement() {
    const t = document.getElementById('ach-title').value, y = document.getElementById('ach-year').value, cat = document.getElementById('ach-cat').value;
    if (!t) { toast('Enter achievement title.'); return; }
    document.getElementById('ach-dash').innerHTML = `<div class="ach-row"><span>🏅 ${t}${y ? ' — ' + y : ''}</span><button class="abtn red">Delete</button></div>` + document.getElementById('ach-dash').innerHTML;
    const row = document.createElement('tr'); row.innerHTML = `<td>🏅 ${t}</td><td>${y || '—'}</td><td><span class="db">${cat}</span></td><td><button class="abtn red">Delete</button></td>`;
    document.getElementById('ach-tbody').prepend(row); closeMod('ach-modal'); toast('Achievement added!');
    document.getElementById('ach-title').value = ''; document.getElementById('ach-year').value = '';
}

// Announcements
function publishAnnounce() { const v = document.getElementById('announce-input').value; if (!v) { toast('Write something first!'); return; } toast('Published!'); document.getElementById('announce-input').value = ''; }
function publishAnnounce2() {
    const v = document.getElementById('announce-input2').value; if (!v) { toast('Write something first!'); return; }
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const item = document.createElement('div'); item.className = 'ann-item';
    item.innerHTML = `<div class="ann-title">New Announcement</div><div class="ann-body">${v}</div><div class="ann-foot"><span>${today}</span><button class="abtn red">Delete</button></div>`;
    document.getElementById('announce-list').prepend(item); toast('Published!'); document.getElementById('announce-input2').value = '';
}

// Modal helpers
function openMod(id) { document.getElementById(id).classList.add('open'); }
function closeMod(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); }));

// Toast
function toast(msg) {
    const t = document.getElementById('toast-msg'); t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}
