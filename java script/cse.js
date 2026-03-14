document.addEventListener("DOMContentLoaded", () => {

  
const batchInput = document.getElementById("regBatch");
const baseYear = 2015;
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
let semester;
if (month <= 6) {
  semester = 1;
} else {
  semester = 2;
}
const maxBatch = (year - baseYear) * 2 + semester;
// set input limits
batchInput.min = 1;
batchInput.max = maxBatch;
batchInput.placeholder = `Batch (1-${maxBatch})`;

  // ---------- Modal Elements ----------
  const joinBtn = document.getElementById("joinBtn");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const closeBtns = document.querySelectorAll(".close");
  const openRegister = document.getElementById("openRegister");

  // ---------- Registration Elements ----------
  const registerSubmit = document.getElementById("registerSubmit");

  // ---------- Login Elements ----------
  const loginSubmit = document.getElementById("loginSubmit");

  // ---------- Open Login Modal ----------
  joinBtn?.addEventListener("click", () => loginModal.classList.add("active"));

  // ---------- Close Modals ----------
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      loginModal.classList.remove("active");
      registerModal.classList.remove("active");
    });
  });



  // ---------- Open Register Modal from Login ----------
  openRegister?.addEventListener("click", () => {
    loginModal.classList.remove("active");
    registerModal.classList.add("active");
  });

  // ---------- Registration ----------
  registerSubmit?.addEventListener("click", async () => {
  const id = document.getElementById("regID").value.trim();
  const name = document.getElementById("regName").value.trim();
  const batch = Number(document.getElementById("regBatch").value.trim());
  const dept = document.getElementById("regDept").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirm").value;

  // ---------- Validation ----------
  if (!id || !name || !batch || !dept || !email || !phone || !password || !confirm) {
    alert("Please fill all required fields!");
    return;
  }
  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }

  try {
    // ---------- Fetch call ----------
    const res = await fetch("http://localhost:5000/api/members/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentID: id, name, batch, department: dept, email, phone, password })
    });

   let data;
try {
  data = await res.json(); // try parsing JSON
} catch (jsonErr) {
  console.error("Server returned invalid JSON:", jsonErr);
  data = {}; // fallback to empty object
}

if (res.ok) {
  registerModal.classList.remove("active");
loginModal.classList.add("active");
document.getElementById("loginID").value = id;

const toast = document.createElement("div");
toast.textContent = "✓ Registration Successful! You can now login.";
toast.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #1a1d6e, #2B2E83);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-family: 'Cinzel', serif;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 9999;
  animation: slideIn 0.3s ease;
`;
document.body.appendChild(toast);
setTimeout(() => document.body.removeChild(toast), 3000);
} 
else {
  // data might be empty, so use optional chaining
  console.error("Server error response:", data?.message || data);
  alert(data?.message || "Registration failed!");
}

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Could not connect to server. Make sure the backend is running and CORS is enabled.");
  }
});

// ---------- Login ----------
loginSubmit?.addEventListener("click", async () => {
  const id = document.getElementById("loginID").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!id || !password) {
    alert("Please enter both ID and password");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/members/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentID: id, password })
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ JWT token stored in localStorage
       console.log("JWT Token:", data.token); 
      localStorage.setItem("token", data.token);
      // member data stored in localStorage
      localStorage.setItem("memberData", JSON.stringify(data.member));

      // Toast show করো
const toast = document.createElement("div");
toast.textContent = "✓ Login Successful!";
toast.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #1a1d6e, #2B2E83);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-family: 'Cinzel', serif;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 9999;
  animation: slideIn 0.3s ease;
`;
document.body.appendChild(toast);

setTimeout(() => {
  window.location.href = "bcsDashboard.html";
}, 1000);
    } else {
      alert(data?.message || "Login failed!");
    }

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Could not connect to server!");
  }
});
document.getElementById('joinBtn2')?.addEventListener('click', () => {
  registerModal.classList.add('active');
});
// ── Password Eye Toggle ──
document.querySelectorAll('.toggle-eye').forEach(eye => {
  eye.addEventListener('click', () => {
    const input = eye.parentElement.querySelector('input');
    if (input.type === 'password') {
      input.type = 'text';
      eye.classList.remove('fa-eye');
      eye.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      eye.classList.remove('fa-eye-slash');
      eye.classList.add('fa-eye');
    }
  });
});
  // ---------- Scroll Reveal Animation ----------
const revealSections = document.querySelectorAll(".why-join, .achievements");

function scrollReveal() {
  const triggerBottom = window.innerHeight * 0.9;
  revealSections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add("show");
      section.querySelectorAll('.join-card, .achievement-card').forEach((card, i) => {
        setTimeout(() => card.classList.add("show"), i * 150);
      });
    }
  });
}

window.addEventListener("scroll", scrollReveal);
window.addEventListener("load", scrollReveal);
setTimeout(scrollReveal, 300);



  // ---------- MVO Section Animation ----------
  const mvoSection = document.querySelector(".mvo-section");
  const mvoCards = document.querySelectorAll(".mvo-card");
  function revealMVO() {
    const triggerBottom = window.innerHeight * 0.85;
    if (mvoSection) {
      const sectionTop = mvoSection.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        mvoSection.classList.add("show");
        mvoCards.forEach((card, index) => {
          setTimeout(() => card.classList.add("show"), index * 150);
        });
      }
    }
  }
  window.addEventListener("scroll", revealMVO);
  window.addEventListener("load", revealMVO);


  // ── FAQ Accordion ──
document.querySelectorAll('.faq-question-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // সব বন্ধ করো
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // clicked টা toggle করো
    if (!isOpen) item.classList.add('open');
  });
});



  // ---------- Welcome Popup ----------
  const popup = document.getElementById("welcomePopup");
  popup?.classList.add("show");
  setTimeout(() => popup?.classList.remove("show"), 4000);
  
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const headerOffset = 70; // navbar height
    const elementPosition = target.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  });
});


// ── Scroll to Top ──
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === Achievements dynamic display ===
const achievements = [
  // You can leave this empty for now to show "No achievements yet"
  // { title: "Champion – National Programming Contest", description: "...", photo: "..." },
];

function loadAchievements() {
  const container = document.getElementById("achievementCards");
  const noMsg = document.getElementById("noAchievementsMsg");

  container.innerHTML = "";

  if (achievements.length === 0) {
    noMsg.style.display = "block";
    return;
  } else {
    noMsg.style.display = "none";
  }

  achievements.forEach(ach => {
    const card = document.createElement("div");
    card.className = "achievement-card";
    card.innerHTML = `
      <img src="${ach.photo}" alt="${ach.title}">
      <div class="achievement-info">
        <h3>${ach.title}</h3>
        <p>${ach.description}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Load achievements on page load
// just call loadAchievements() inside top DOMContentLoaded
// ── Mobile Navbar ──
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.querySelector('.navbar nav');

hamburgerBtn?.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('active');
  mobileNav.classList.toggle('open');
});

// Members dropdown — mobile
const dropdown = document.querySelector('.navbar .dropdown');
const dropbtn = dropdown?.querySelector('a.dropbtn');
dropbtn?.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    e.preventDefault();
    dropdown.classList.toggle('open');
  }
});

// Mobile Login button
document.getElementById('mobileLoginBtn')?.addEventListener('click', () => {
  loginModal.classList.add('active');
  mobileNav.classList.remove('open');
  hamburgerBtn.classList.remove('active');
});

// Outside click — menu বন্ধ
document.addEventListener('click', (e) => {
  if (!e.target.closest('header.navbar')) {
    mobileNav?.classList.remove('open');
    hamburgerBtn?.classList.remove('active');
  }
});
loadAchievements();


});