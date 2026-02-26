document.addEventListener("DOMContentLoaded", () => {
  
  // Register validation
const registerSubmit = document.getElementById("registerSubmit");

if (registerSubmit) {
  registerSubmit.addEventListener("click", () => {
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    alert("Registration Successful!");
  });
}

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

});
// Achievements & Why Join Us scroll reveal
const revealSections = document.querySelectorAll(".why-join, .achievements");

function scrollReveal() {
  const triggerBottom = window.innerHeight * 0.85;

  revealSections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerBottom) {
      // Add 'show' class to animate children
      section.classList.add("show");
    }
  });
}

window.addEventListener("scroll", scrollReveal);
window.addEventListener("load", scrollReveal);