// events.js — Events Page

const allEvents = [
    { day: "15", month: "APR", name: "BAUET Hackathon 2026", club: "Computer Society", venue: "Main Auditorium", time: "9:00 AM", status: "open" },
    { day: "22", month: "APR", name: "Inter-College Debate Championship", club: "Debate Club", venue: "Seminar Hall", time: "10:00 AM", status: "soon" },
    { day: "30", month: "APR", name: "Boisakhi Cultural Night", club: "Cultural Club", venue: "BAUET Ground", time: "5:00 PM", status: "soon" },
    { day: "10", month: "MAY", name: "Photography Exhibition 2026", club: "Photography Club", venue: "Gallery Hall", time: "11:00 AM", status: "open" },
    { day: "18", month: "MAY", name: "Sports Day 2026", club: "Sports Club", venue: "BAUET Field", time: "8:00 AM", status: "soon" },
    { day: "25", month: "MAY", name: "Annual Tech Seminar", club: "Computer Society", venue: "Auditorium", time: "2:00 PM", status: "soon" },
    { day: "05", month: "JUN", name: "Mind Storm 2026", club: "Computer Society", venue: "Main Lab", time: "10:00 AM", status: "open" },
    { day: "15", month: "JUN", name: "Cultural Fiesta 2026", club: "Cultural Club", venue: "Open Stage", time: "4:00 PM", status: "soon" },
];

function renderEvents(list) {
    const container = document.getElementById('events-container');
    if (!list.length) {
        container.innerHTML = '<div class="no-results">No events found.</div>';
        return;
    }
    container.innerHTML = list.map(e => `
    <div class="event-item">
      <div class="event-date">
        <div class="event-day">${e.day}</div>
        <div class="event-month">${e.month}</div>
      </div>
      <div class="event-info">
        <div class="event-name">${e.name}</div>
        <div class="event-club">${e.club} · ${e.venue} · ${e.time}</div>
      </div>
      <span class="badge ${e.status === 'open' ? 'badge-open' : 'badge-soon'}">
        ${e.status === 'open' ? '🟢 Registration Open' : '🔵 Upcoming'}
      </span>
    </div>
  `).join('');
}

function filterEvents() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const club = document.getElementById('club-filter').value;
    const status = document.getElementById('status-filter').value;

    const filtered = allEvents.filter(e => {
        const matchSearch = e.name.toLowerCase().includes(search) || e.club.toLowerCase().includes(search);
        const matchClub = !club || e.club === club;
        const matchStatus = !status || e.status === status;
        return matchSearch && matchClub && matchStatus;
    });
    renderEvents(filtered);
}

renderEvents(allEvents);
