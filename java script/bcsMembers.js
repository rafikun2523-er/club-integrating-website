document.addEventListener("DOMContentLoaded", () => {

  // ── Base URL ──
  const BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

  // ── Toast ──
  function showToast(msg, isError = false) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: ${isError ? "linear-gradient(135deg,#8b0000,#c0392b)" : "linear-gradient(135deg,#1a1d6e,#2B2E83)"};
      color: white; padding: 12px 24px; border-radius: 10px;
      font-family: 'Cinzel', serif; font-size: 14px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 9999;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast); }, 3000);
  }

  // ── Members Data ──
  let allMembers = [];
  let activeTab  = "all";

  async function loadMembers() {
    const tableBody = document.getElementById("membersTableBody");

    try {
      const res = await fetch(`${BASE_URL}/api/members/all`);
      if (!res.ok) throw new Error("Failed");

      allMembers = await res.json();

      // Stats
      const depts   = [...new Set(allMembers.map(m => m.department))];
      const batches = [...new Set(allMembers.map(m => m.batch))];

      document.getElementById("totalMembers").textContent = allMembers.length;
      document.getElementById("totalDepts").textContent   = depts.length;
      document.getElementById("totalBatches").textContent = batches.length;

      // Dept tabs
      const tabsContainer = document.getElementById("deptTabs");
      tabsContainer.innerHTML = `
        <button class="dept-tab active" data-dept="all">
          All <span class="dept-count">${allMembers.length}</span>
        </button>
      `;

      depts.sort().forEach(dept => {
        const count = allMembers.filter(m => m.department === dept).length;
        const btn   = document.createElement("button");
        btn.className    = "dept-tab";
        btn.dataset.dept = dept;
        btn.innerHTML    = `${dept} <span class="dept-count">${count}</span>`;
        tabsContainer.appendChild(btn);
      });

      // Tab click
      tabsContainer.querySelectorAll(".dept-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          tabsContainer.querySelectorAll(".dept-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          activeTab = tab.dataset.dept;
          renderMembers();
        });
      });

      renderMembers();

    } catch (err) {
      tableBody.innerHTML = `<div class="members-empty">Could not load members. Please try again later.</div>`;
    }
  }

function renderMembers() {
  const tableBody   = document.getElementById("membersTableBody");
  const searchQuery = document.getElementById("memberSearch")?.value.toLowerCase() || "";

  let filtered = activeTab === "all"
    ? allMembers
    : allMembers.filter(m => m.department === activeTab);

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(searchQuery)
    );
  }

    if (filtered.length === 0) {
      tableBody.innerHTML = `<div class="members-empty">No members found in this department.</div>`;
      return;
    }

    tableBody.innerHTML = filtered.map((m, i) => {
      const initials = m.name
        ? m.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";

      const photoUrl = m.photo && m.photo !== ""
        ? (m.photo.startsWith("http") ? m.photo : `${BASE_URL}${m.photo}`)
        : null;

      const avatar = photoUrl
        ? `<div class="member-avatar"><img src="${photoUrl}" alt="${m.name}" onerror="this.parentElement.textContent='${initials}'"></div>`
        : `<div class="member-avatar">${initials}</div>`;

      return `
        <div class="member-row">
          <span class="member-serial">${i + 1}</span>
          <div class="member-name-cell">
            ${avatar}
            <span class="member-name">${m.name}</span>
          </div>
          <span class="member-dept-badge">${m.department}</span>
          <span class="member-batch">${m.batch}</span>
        </div>
      `;
    }).join("");
  }
document.getElementById("memberSearch")?.addEventListener("input", () => {
  renderMembers();
});
  loadMembers();

  // ── Modals ──
  const loginModal    = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const joinBtn       = document.getElementById("joinBtn");
  const closeBtns     = document.querySelectorAll(".close");
  const openRegister  = document.getElementById("openRegister");

  joinBtn?.addEventListener("click", () => loginModal.classList.add("active"));

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      loginModal.classList.remove("active");
      registerModal.classList.remove("active");
    });
  });

  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        loginModal.classList.remove("active");
        registerModal.classList.remove("active");
      }
    });
  });

  openRegister?.addEventListener("click", () => {
    loginModal.classList.remove("active");
    registerModal.classList.add("active");
  });

  // ── Login ──
  document.getElementById("loginSubmit")?.addEventListener("click", async () => {
    const id       = document.getElementById("loginID").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!id || !password) { showToast("Please enter both ID and password!", true); return; }

    try {
      const res  = await fetch(`${BASE_URL}/api/members/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentID: id, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("memberData", JSON.stringify(data.member));
        showToast("✓ Login Successful!");
        setTimeout(() => { window.location.href = "bcsDashboard.html"; }, 1000);
      } else {
        showToast(data?.message || "Login failed!", true);
      }
    } catch { showToast("Could not connect to server!", true); }
  });

  // ── Register ──
  const batchInput = document.getElementById("regBatch");
  const baseYear   = 2015;
  const now        = new Date();
  const semester   = (now.getMonth() + 1) <= 6 ? 1 : 2;
  const maxBatch   = (now.getFullYear() - baseYear) * 2 + semester;
  if (batchInput) {
    batchInput.min         = 1;
    batchInput.max         = maxBatch;
    batchInput.placeholder = `Batch (1-${maxBatch})`;
  }

  document.getElementById("registerSubmit")?.addEventListener("click", async () => {
    const id       = document.getElementById("regID").value.trim();
    const name     = document.getElementById("regName").value.trim();
    const batch    = Number(document.getElementById("regBatch").value.trim());
    const dept     = document.getElementById("regDept").value.trim();
    const email    = document.getElementById("regEmail").value.trim();
    const phone    = document.getElementById("regPhone").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm  = document.getElementById("regConfirm").value;

    if (!id || !name || !batch || !dept || !email || !phone || !password || !confirm) {
      showToast("Please fill all required fields!", true); return;
    }
    if (password !== confirm) { showToast("Passwords do not match!", true); return; }
    if (password.length < 6) { showToast("Password must be at least 6 characters!", true); return; }

    try {
      const res  = await fetch(`${BASE_URL}/api/members/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentID: id, name, batch, department: dept, email, phone, password })
      });
      let data;
      try { data = await res.json(); } catch { data = {}; }
      if (res.ok) {
        registerModal.classList.remove("active");
        loginModal.classList.add("active");
        document.getElementById("loginID").value = id;
        showToast("✓ Registration Successful! You can now login.");
        loadMembers(); // refresh members list
      } else {
        showToast(data?.message || "Registration failed!", true);
      }
    } catch { showToast("Could not connect to server!", true); }
  });

  // ── Eye Toggle ──
  document.querySelectorAll(".toggle-eye").forEach(eye => {
    eye.addEventListener("click", () => {
      const input = eye.parentElement.querySelector("input");
      if (input.type === "password") {
        input.type = "text";
        eye.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        eye.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  // ── Mobile Navbar ──
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav    = document.querySelector(".navbar nav");

  hamburgerBtn?.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("active");
    mobileNav.classList.toggle("open");
  });

  document.getElementById("mobileLoginBtn")?.addEventListener("click", () => {
    loginModal.classList.add("active");
    mobileNav.classList.remove("open");
    hamburgerBtn.classList.remove("active");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("header.navbar")) {
      mobileNav?.classList.remove("open");
      hamburgerBtn?.classList.remove("active");
    }
  });

});
