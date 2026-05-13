function generateInitials(fullName) {
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function loadTeamInitials() {
  const teamCards = document.querySelectorAll('.team-card');

  teamCards.forEach(card => {
    const nameEl = card.querySelector('.team-name');
    const avatarEl = card.querySelector('.team-avatar');

    if (nameEl && avatarEl) {
      const name = nameEl.textContent.trim();
      const initials = generateInitials(name);
      avatarEl.textContent = initials;
    }
  });
}


document.addEventListener('DOMContentLoaded', loadTeamInitials);
