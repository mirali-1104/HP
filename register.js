document.getElementById("registration-form").addEventListener("submit", async function (event) {
    event.preventDefault(); 

    console.log("📥 Form submitted! Processing...");

    let teamName = document.getElementById("team-name").value.trim();
    let institution = document.getElementById("institution").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let members = document.getElementById("team-members").value.trim();
    let category = document.getElementById("category").value;

    if (!teamName || !institution || !email || !password || !members || category === "Select a category") {
        alert("⚠️ Please fill out all fields before submitting.");
        console.error("❌ Validation failed: Missing required fields.");
        return;
    }

    const userData = {
        teamName,
        institution,
        email,
        password,
        category,
        teamMembers: members.split(",").map(member => member.trim())
    };

    console.log("📤 Sending data to backend:", userData);

    try {
        const response = await fetch("http://localhost:5000/api/student/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        console.log("🔄 Waiting for server response...");

        const data = await response.json();

        console.log("🔍 Server response:", data);

        if (response.ok) {
            alert("✅ Registration Successful!");
            localStorage.setItem("user", JSON.stringify(userData));
            window.location.href = "login.html"; 
        } else {
            alert(`❌ Registration Failed: ${data.msg}`);
        }
    } catch (error) {
        console.error("❌ Registration Error:", error);
        alert("⚠️ Server Error. Please try again later.");
    }
});
