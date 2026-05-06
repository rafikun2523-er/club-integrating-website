async function login() {
    const adminId = document.getElementById("adminId").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:5000/admin-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ adminId, password })
        });

        const data = await res.json();

        const popup = document.getElementById("popup");
        const msg = document.getElementById("popup-message");

        if (data.success) {
            msg.innerText = "Login Successful";
        } else {
            msg.innerText = "Invalid ID or Password";
        }

        popup.style.display = "flex";

    } catch (error) {
        console.log(error);
    }
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Eye Toggle
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
