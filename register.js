document.getElementById("add-member").addEventListener("click", function () {
  const container = document.getElementById("team-members-container");

  const div = document.createElement("div");
  div.classList.add("team-member");

  div.innerHTML = `
        <input type="text" placeholder="Member Name" class="member-name" required>
        <input type="text" placeholder="Role (e.g. Developer, Designer)" class="member-role" required>
        <button type="button" class="remove-member">❌</button>
    `;

  div.querySelector(".remove-member").addEventListener("click", function () {
    div.remove();
  });

  container.appendChild(div);
});

document
  .getElementById("registration-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("📥 Form submitted! Processing...");

    let teamName = document.getElementById("team-name").value.trim();
    let institution = document.getElementById("institution").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let category = document.getElementById("category").value;

    if (!teamName || !institution || !email || !password || category === "") {
      alert("⚠️ Please fill out all fields before submitting.");
      console.error("❌ Validation failed: Missing required fields.");
      return;
    }

    let members = [];
    document.querySelectorAll(".team-member").forEach((memberDiv) => {
      let name = memberDiv.querySelector(".member-name").value.trim();
      let role = memberDiv.querySelector(".member-role").value.trim();

      if (name && role) {
        members.push({ name, role });
      }
    });

    if (members.length === 0) {
      alert("⚠️ Please add at least one team member.");
      return;
    }

    const userData = {
      teamName,
      institution,
      email,
      password,
      category,
      teamMembers: members,
    };

    console.log("📤 Sending data to backend:", userData);

    try {
      const response = await fetch(
        "http://localhost:5000/api/student/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

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
