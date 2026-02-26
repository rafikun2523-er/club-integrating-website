document.addEventListener("DOMContentLoaded", () => {

  // Registration Validation
  const registerSubmit = document.getElementById("registerSubmit");

  if (registerSubmit) {
    registerSubmit.addEventListener("click", () => {
      const id = document.getElementById("regID").value;
      const name = document.getElementById("regName").value;
      const password = document.getElementById("regPassword").value;
      const confirm = document.getElementById("regConfirm").value;

      if (id === "" || name === "" || password === "" || confirm === "") {
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

      alert("🎉 Computer Club Registration Successful!");
      document.getElementById("registerModal").classList.remove("active");
    });
  }

  // Modal Controls

  const joinBtn = document.getElementById("joinBtn");
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const closeBtns = document.querySelectorAll(".close");
  const openRegister = document.getElementById("openRegister");

  // Open login modal
  if (joinBtn) {
    joinBtn.addEventListener("click", () => {
      loginModal.classList.add("active");
    });
  }

  // Close modals
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      loginModal.classList.remove("active");
      registerModal.classList.remove("active");
    });
  });

  // Open register modal
  if (openRegister) {
    openRegister.addEventListener("click", () => {
      loginModal.classList.remove("active");
      registerModal.classList.add("active");
    });
  }

  // Login System (Demo)
  const loginSubmit = document.getElementById("loginSubmit");

  if (loginSubmit) {
    loginSubmit.addEventListener("click", () => {
      const id = document.getElementById("loginID").value;
      const pass = document.getElementById("loginPassword").value;

      if (id === "" || pass === "") {
        alert("Enter Student ID & Password!");
        return;
      }

      // Demo login 
      alert("✅ Login Successful! Welcome to BAUET Computer Club");
      loginModal.classList.remove("active");
    });
  }

});


// Scroll Reveal Animation

const revealSections = document.querySelectorAll(".why-join, .achievements");

function scrollReveal() {
  const triggerBottom = window.innerHeight * 0.85;

  revealSections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      section.classList.add("show");
    }
  });
}

window.addEventListener("scroll", scrollReveal);
window.addEventListener("load", scrollReveal);

// Scroll Reveal for MVO Section
const mvoSection = document.querySelector(".mvo-section");
const mvoCards = document.querySelectorAll(".mvo-card");

function revealMVO() {
  const triggerBottom = window.innerHeight * 0.85;
  if (mvoSection) {
    const sectionTop = mvoSection.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      mvoSection.classList.add("show");
      mvoCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("show");
        }, index * 150); // stagger effect
      });
    }
  }
}

window.addEventListener("scroll", revealMVO);
window.addEventListener("load", revealMVO);
const faqIcon = document.getElementById("faqSearchIcon"); // search icon
const faqSidebar = document.getElementById("faqSidebar");
const faqInput = document.getElementById("faqSearchInput");
const faqListItems = document.querySelectorAll("#faqList li");

// Toggle sidebar on search icon click
faqIcon.addEventListener("click", () => {
  faqSidebar.classList.toggle("show");
  faqInput.value = "";
  faqListItems.forEach(li => li.classList.remove("hide"));
  faqInput.focus();
});

// Live search/filter
faqInput.addEventListener("input", () => {
  const query = faqInput.value.toLowerCase();
  faqListItems.forEach(li => {
    if (li.textContent.toLowerCase().includes(query)) {
      li.classList.remove("hide");
    } else {
      li.classList.add("hide");
    }
  });
});

window.addEventListener("load", () => {

  const popup = document.getElementById("welcomePopup");
  const sound = document.getElementById("welcomeSound");

  popup.classList.add("show");

  sound.play().catch(() => {});

  setTimeout(() => {
    popup.classList.remove("show");
  }, 4000);

});
document.getElementById('welcomePopup').classList.add('show');