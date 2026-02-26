// ===== Select Elements =====
const joinBtn = document.getElementById('joinBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeBtns = document.querySelectorAll('.close');
const openRegister = document.getElementById('openRegister');
const loginSubmit = document.getElementById('loginSubmit');
const registerSubmit = document.getElementById('registerSubmit');

// ===== Show Login Modal =====
joinBtn.addEventListener('click', () => {
  loginModal.classList.add('active');
});

// ===== Close Modals =====
closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    loginModal.classList.remove('active');
    registerModal.classList.remove('active');
  });
});

// Close modal if clicked outside content
window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.classList.remove('active');
  if (e.target === registerModal) registerModal.classList.remove('active');
});

// ===== Switch to Register Modal =====
openRegister.addEventListener('click', () => {
  loginModal.classList.remove('active');
  registerModal.classList.add('active');
});

// ===== Login Form Submission =====
loginSubmit.addEventListener('click', () => {
  const studentID = document.getElementById('loginID').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!studentID || !password) {
    alert('Please enter both Student ID and Password.');
    return;
  }

  // For now, just demo alert
  alert(`Logged in as: ${studentID}`);
  loginModal.classList.remove('active');
});

// ===== Register Form Submission =====
registerSubmit.addEventListener('click', () => {
  const studentID = document.getElementById('regID').value.trim();
  const name = document.getElementById('regName').value.trim();
  const batch = document.getElementById('regBatch').value.trim();
  const dept = document.getElementById('regDept').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const confirm = document.getElementById('regConfirm').value.trim();

  if (!studentID || !name || !batch || !dept || !email || !phone || !password || !confirm) {
    alert('Please fill all the fields.');
    return;
  }

  if (password !== confirm) {
    alert('Passwords do not match!');
    return;
  }

  // Demo alert
  alert(`Registered Successfully!\nWelcome ${name} to BAUET Cultural Club.`);
  registerModal.classList.remove('active');

  // Clear form fields
  document.getElementById('regID').value = '';
  document.getElementById('regName').value = '';
  document.getElementById('regBatch').value = '';
  document.getElementById('regDept').value = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regPhone').value = '';
  document.getElementById('regPassword').value = '';
  document.getElementById('regConfirm').value = '';
});

// ===== Optional: Scroll Reveal for Achievements & Why Join =====
const revealElements = document.querySelectorAll('.why-join, .achievements');

window.addEventListener('scroll', () => {
  const triggerBottom = window.innerHeight * 0.85;

  revealElements.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop < triggerBottom) {
      section.classList.add('show');
    }
  });
});