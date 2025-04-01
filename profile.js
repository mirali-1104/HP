document.addEventListener("DOMContentLoaded", async function () {
  const teamNameInput = document.getElementById("team-name");
  const teamMembersDiv = document.getElementById("team-members");
  const newMemberInput = document.getElementById("new-member");
  const addMemberBtn = document.getElementById("add-member-btn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const profileForm = document.getElementById("profile-form");

  let teamMembers = [];
  let userId = null;

  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser || !storedUser.email) {
    alert("No logged-in user found!");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/students?email=${storedUser.email}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const student = await response.json();

    userId = student.userId;
    teamNameInput.value = student.teamName || "";
    emailInput.value = student.email || "";
    teamMembers = student.teamMembers || [];

    renderTeamMembers();
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Failed to load user data. Please try again.");
  }

  function renderTeamMembers() {
    teamMembersDiv.innerHTML = "";

    teamMembers.forEach((member, index) => {
      const memberElement = document.createElement("div");
      memberElement.innerHTML = `
        <strong>${member.name}</strong> - ${member.role} 
        <button data-index="${index}" class="remove-member">Remove</button>
      `;
      teamMembersDiv.appendChild(memberElement);
    });
  }

  addMemberBtn.addEventListener("click", function () {
    const newMemberName = newMemberInput.value.trim();
    if (!newMemberName) return;

    const newMemberRole = prompt("Enter role for this team member:");
    if (!newMemberRole) return;

    teamMembers.push({ name: newMemberName, role: newMemberRole });
    renderTeamMembers();
    newMemberInput.value = "";
  });

  teamMembersDiv.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-member")) {
      const index = e.target.dataset.index;
      teamMembers.splice(index, 1);
      renderTeamMembers();
    }
  });

  profileForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!userId) {
      alert("User ID not found. Cannot update profile.");
      console.error("🚨 User ID is missing. Check API response!");
      return;
    }

    const updatedEmail = emailInput.value.trim();
    const updatedPassword = passwordInput.value.trim();
    const updatedTeamName = teamNameInput.value.trim();

    console.log("Updating user with:", {
      email: updatedEmail,
      ...(updatedPassword && { password: updatedPassword }),
      teamName: updatedTeamName,
      teamMembers,
    });

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: updatedEmail,
            ...(updatedPassword && { password: updatedPassword }),
            teamName: updatedTeamName,
            teamMembers,
          }),
        }
      );

      const result = await response.json();
      console.log("Response from server:", result);

      if (!response.ok) {
        throw new Error(result.msg || "Update failed");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          email: updatedEmail,
          teamName: updatedTeamName,
        })
      );

      alert("Profile updated successfully!");
      window.location.href = "user-dashboard.html";
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  });
});
