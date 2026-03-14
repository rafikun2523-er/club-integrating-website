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
  alert("🎉 Registration Successful! You can now login.");
  registerModal.classList.remove("active");
  loginModal.classList.add("active");
  document.getElementById("loginID").value = id;
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

      alert("Login Successful!");
      // redirect to profile page
      window.location.href = "bcsDashboard.html";
    } else {
      alert(data?.message || "Login failed!");
    }

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Could not connect to server!");
  }
});
  // ---------- Scroll Reveal Animation ----------
  const revealSections = document.querySelectorAll(".why-join, .achievements");
  function scrollReveal() {
    const triggerBottom = window.innerHeight * 0.85;
    revealSections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) section.classList.add("show");
    });
  }
  window.addEventListener("scroll", scrollReveal);
  window.addEventListener("load", scrollReveal);



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



  // ---------- FAQ Search ----------
  const faqIcon = document.getElementById("faqSearchIcon");
  const faqSidebar = document.getElementById("faqSidebar");
  const faqInput = document.getElementById("faqSearchInput");
  const faqListItems = document.querySelectorAll("#faqList li");

  faqIcon?.addEventListener("click", () => {
    faqSidebar.classList.toggle("show");
    faqInput.value = "";
    faqListItems.forEach(li => li.classList.remove("hide"));
    faqInput.focus();
  });

  faqInput?.addEventListener("input", () => {
    const query = faqInput.value.toLowerCase();
    faqListItems.forEach(li => {
      li.classList.toggle("hide", !li.textContent.toLowerCase().includes(query));
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
loadAchievements();

});