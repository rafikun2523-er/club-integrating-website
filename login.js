// Login Function
function login() {

    // Get input values
    let id = document.getElementById("adminId").value.trim();
    let pass = document.getElementById("password").value.trim();

    // Demo credentials (Frontend Only)
    let demoId = "admin";
    let demoPass = "1234";

    // Popup elements
    let popup = document.getElementById("popup");
    let message = document.getElementById("popup-message");

    // Empty field check
    if (id === "" || pass === "") {
        message.innerHTML = `
            <div style="
                background:#ff9800;
                color:white;
                padding:12px;
                border-radius:8px;
                font-weight:bold;
            ">
                ⚠ Please fill all fields!
            </div>
        `;
        popup.style.display = "flex";
        return;
    }

    // Correct login
    if (id === demoId && pass === demoPass) {
        
        // Save admin ID
        localStorage.setItem("adminId", id);

        message.innerHTML = `
            <div style="
                background:#28a745;
                color:white;
                padding:12px;
                border-radius:8px;
                font-weight:bold;
            ">
                ✔ Login Successful!
            </div>
        `;
        popup.style.display = "flex";

        // Redirect after 1.5 sec
        setTimeout(() => {
            popup.style.display = "none";
            window.location.href = "dashboard.html";
        }, 1500);

    } 
    // Wrong login
    else {
        message.innerHTML = `
            <div style="
                background:#ff4c4c;
                color:white;
                padding:12px;
                border-radius:8px;
                font-weight:bold;
                animation: shake 0.3s;
            ">
                ❌ Invalid Admin ID or Password!
            </div>
        `;
        popup.style.display = "flex";
    }
}


// Close Popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}


// Press Enter to Login
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        login();
    }
});