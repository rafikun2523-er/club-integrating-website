// ===== Get Elements =====
const joinBtn = document.getElementById("joinBtn");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const closeButtons = document.querySelectorAll(".close");
const openRegister = document.getElementById("openRegister");


// ===== Open Login Modal =====
if (joinBtn && loginModal) {
  joinBtn.addEventListener("click", () => {
    loginModal.classList.add("active");
  });
}



// ===== Close Modals =====
closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    loginModal.classList.remove("active");
    registerModal.classList.remove("active");
  });
});


// ===== Switch to Register Modal =====
openRegister.addEventListener("click", () => {
  loginModal.classList.remove("active");
  registerModal.classList.add("active");
});


// ===== Close when clicking outside =====
window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove("active");
  }
  if (e.target === registerModal) {
    registerModal.classList.remove("active");
  }
});


// ===== Simple Login Validation =====
document.getElementById("loginSubmit").addEventListener("click", () => {
  const id = document.getElementById("loginID").value;
  const pass = document.getElementById("loginPassword").value;

  if (id === "" || pass === "") {
    alert("Please enter Student ID and Password");
  } else {
    alert("Login Successful!");
    loginModal.classList.remove("active");
  }
});


// ===== Simple Registration Validation =====
document.getElementById("registerSubmit").addEventListener("click", () => {
  const pass = document.getElementById("regPassword").value;
  const confirm = document.getElementById("regConfirm").value;

  if (pass !== confirm) {
    alert("Passwords do not match!");
  } else {
    alert("Registration Successful!");
    registerModal.classList.remove("active");
  }
});


// ===== Scroll Reveal Animation =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

observer.observe(document.getElementById("whyJoin"));
observer.observe(document.getElementById("achievements"));