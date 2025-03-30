document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let enteredEmail = document.getElementById("login-email").value.trim();
    let enteredPassword = document.getElementById("password").value.trim();

    if (!enteredEmail || !enteredPassword) {
        alert("⚠️ Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/judge/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: enteredEmail, password: enteredPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Login Successful! Redirecting to Dashboard...");
            
            
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "judge-dashboard.html"; 
        } else {
            alert(`❌ Login Failed: ${data.msg}`);
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        alert("⚠️ Server Error. Please try again later.");
    }
});
