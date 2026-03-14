document.addEventListener("DOMContentLoaded", () => {
  // ---------- Get Member Data ----------
  let member = null;
  try {
    member = JSON.parse(localStorage.getItem("memberData"));
  } catch (err) {
    console.error("Invalid localStorage data");
  }

  if (!member) {
    window.location.href = "cse.html"; // redirect if not logged in
    return;
  }

  // ---------- DOM Elements ----------
  const profileImage = document.getElementById("profileImage");
  const defaultAvatar = document.getElementById("defaultAvatar");
  const upload = document.getElementById("uploadImage");

  const studentIDEl = document.getElementById("studentID");
  const nameEl = document.getElementById("name");
  const batchEl = document.getElementById("batch");
  const deptEl = document.getElementById("department");
  const emailEl = document.getElementById("email");
  const phoneEl = document.getElementById("phone");

  const openPassword = document.getElementById("openPassword");
  const passwordForm = document.getElementById("passwordForm");
  const oldPassEl = document.getElementById("oldPass");
  const newPassEl = document.getElementById("newPass");
  const confirmPassEl = document.getElementById("confirmPass");
  const changePasswordBtn = document.getElementById("changePassword");

  // ---------- Fill Profile Info ----------
  studentIDEl.textContent = member.studentID;
  nameEl.textContent = member.name;
  batchEl.textContent = member.batch;
  deptEl.textContent = member.department;
  emailEl.textContent = member.email;
  phoneEl.textContent = member.phone;

  // ---------- Show Avatar / Photo ----------
  function updateAvatarDisplay() {
    if (member.photo) {
      profileImage.src = member.photo;
      profileImage.style.opacity = "1";
      defaultAvatar.style.display = "none"; // hide default icon
    } else {
      profileImage.src = "";
      profileImage.style.opacity = "0";
      defaultAvatar.style.display = "block"; // show default icon
    }
  }

  updateAvatarDisplay();

  // ---------- Upload Profile Photo ----------
  upload.addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Login first!");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:5000/api/members/upload-photo", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
          // Do NOT set Content-Type here for multipart/form-data
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        member.photo = data.photo;
        localStorage.setItem("memberData", JSON.stringify(member));
        updateAvatarDisplay();
        alert("Photo uploaded successfully!");
        upload.value = ""; // reset file input
      } else {
        alert(data?.message || "Upload failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error!");
    }
  });

  // ---------- Toggle Password Form ----------
  openPassword.addEventListener("click", () => {
    passwordForm.style.display = passwordForm.style.display === "block" ? "none" : "block";
  });

  // ---------- Change Password (via backend) ----------
  changePasswordBtn.addEventListener("click", async () => {
    const oldPass = oldPassEl.value.trim();
    const newPass = newPassEl.value.trim();
    const confirmPass = confirmPassEl.value.trim();

    if (!oldPass || !newPass || !confirmPass) {
      alert("Fill all fields");
      return;
    }

    if (newPass !== confirmPass) {
      alert("New password does not match");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Login first!");

    try {
      const res = await fetch("http://localhost:5000/api/members/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully!");
        oldPassEl.value = "";
        newPassEl.value = "";
        confirmPassEl.value = "";
        passwordForm.style.display = "none";
      } else {
        alert(data?.message || "Password update failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Password update error!");
    }
  });
});