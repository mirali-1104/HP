document.getElementById("logout-btn").addEventListener("click", async function () {
    try {
        const response = await fetch("http://localhost:5000/api/logout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Logout failed");

        window.location.href = "login.html";
    } catch (error) {
        console.error("Error logging out:", error);
        alert("Logout failed. Please try again.");
    }
});
