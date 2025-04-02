document.addEventListener("DOMContentLoaded", async function () {
  const adminId = "67ec44b00fe2a9db5abf6000";
  const adminNameDisplay = document.getElementById("adminNameDisplay");
  const adminEmailDisplay = document.getElementById("adminEmailDisplay");
  const groupsContainer = document.getElementById("groupsContainer");
  const projectCardsContainer = document.getElementById(
    "project-cards-container"
  );

  // Fetch and display projects
  try {
    const response = await fetch("http://localhost:5000/api/projects");
    if (!response.ok) throw new Error("Network response was not ok");

    const projects = await response.json();
    projects.forEach((project) => {
      const projectCard = createProjectCard(project);
      projectCardsContainer.appendChild(projectCard);
    });
  } catch (error) {
    console.error("Fetching projects failed:", error);
  }

  // Fetch admin details
  async function fetchAdminDetails() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/${adminId}`
      );
      if (!response.ok) throw new Error(`Failed: ${response.statusText}`);

      const admin = await response.json();
      if (admin?.name && admin?.email) {
        adminNameDisplay.textContent = admin.name;
        adminEmailDisplay.textContent = admin.email;
      } else throw new Error("Invalid admin data.");
    } catch (error) {
      console.error("Admin Fetch Error:", error);
      alert(`❌ ${error.message}`);
    }
  }

  // Fetch total students
  async function fetchTotalStudents() {
    try {
      const response = await fetch("http://localhost:5000/api/total-students");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const { totalStudents } = await response.json();
      document.querySelector("#totalTeamsCount").textContent = totalStudents;
    } catch (error) {
      console.error("Student Count Error:", error);
    }
  }

  // Fetch total projects
  async function fetchTotalProjects() {
    try {
      const response = await fetch("http://localhost:5000/api/total-projects");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const { totalProjects } = await response.json();
      document.querySelector("#totalProjectsCount").textContent = totalProjects;
    } catch (error) {
      console.error("Project Count Error:", error);
    }
  }

  // Fetch total judges
  async function fetchTotalJudge() {
    try {
      const response = await fetch("http://localhost:5000/api/total-judge");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const { totalJudge } = await response.json();
      document.querySelector("#totalJudgeCount").textContent = totalJudge;
    } catch (error) {
      console.error("Judge Count Error:", error);
    }
  }

  // Update layout based on sidebar state
  function updateLayout() {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const topBar = document.getElementById("topBar");

    if (!sidebar || !content || !topBar) {
      return console.error("Layout elements missing.");
    }

    const isCollapsed = sidebar.classList.contains("collapsed");
    const marginSize = isCollapsed ? "70px" : "250px";

    content.style.marginLeft = marginSize;
    content.style.width = `calc(100% - ${marginSize})`;
    topBar.style.marginLeft = marginSize;
    topBar.style.width = `calc(100% - ${marginSize})`;
  }

  // Fetch students and display them
  async function fetchStudents() {
    try {
      const response = await fetch("http://localhost:5000/api/students");
      if (!response.ok)
        throw new Error(`Failed to fetch students: ${response.statusText}`);

      const students = await response.json();
      displayStudents(students);
    } catch (error) {
      console.error("Student Fetch Error:", error);
    }
  }

  // Display students in groups
  function displayStudents(students) {
    console.log("Displaying students:", students);
    groupsContainer.innerHTML = ""; // Clear previous content

    if (!students || students.length === 0) {
      groupsContainer.innerHTML = "<p>No teams found.</p>";
      return;
    }

    const teams = {};

    students.forEach((student) => {
      if (!teams[student.teamName]) teams[student.teamName] = [];
      teams[student.teamName].push(student);
    });

    for (const team in teams) {
      const teamDiv = document.createElement("div");
      teamDiv.classList.add("team-container");

      const teamTitle = document.createElement("p");
      teamTitle.classList.add("team-name");
      teamTitle.textContent = `Team: ${team}`;

      const studentList = document.createElement("ul");
      teams[team].forEach((student) => {
        student.teamMembers.forEach((member) => {
          const listItem = document.createElement("li");
          listItem.textContent = member.name || "Unknown";
          studentList.appendChild(listItem);
        });
      });

      teamDiv.appendChild(teamTitle);
      teamDiv.appendChild(studentList);
      groupsContainer.appendChild(teamDiv);
    }
  }

  // Setup profile modal
  function setupProfileModal() {
    const modal = document.getElementById("profileModal");
    const userProfile = document.getElementById("userProfile");
    const closeModal = document.getElementsByClassName("close")[0];
    const adminNameInput = document.getElementById("adminName");
    const adminEmailInput = document.getElementById("adminEmail");
    const adminPasswordInput = document.getElementById("adminPassword");
    const profileForm = document.getElementById("profileForm");

    if (!modal || !userProfile || !closeModal || !profileForm) return;

    userProfile.onclick = function () {
      modal.style.display = "block";
      adminNameInput.value = adminNameDisplay.textContent;
      adminEmailInput.value = adminEmailDisplay.textContent;
    };

    closeModal.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) modal.style.display = "none";
    };

    profileForm.onsubmit = async function (event) {
      event.preventDefault();
      const adminData = {
        name: adminNameInput.value,
        email: adminEmailInput.value,
      };

      if (adminPasswordInput.value)
        adminData.password = adminPasswordInput.value;

      try {
        const response = await fetch(
          `http://localhost:5000/api/update-admin/${adminId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adminData),
          }
        );

        const result = await response.json();
        if (response.ok) {
          alert("✅ Admin details updated successfully!");
          adminNameDisplay.textContent = adminData.name;
          adminEmailDisplay.textContent = adminData.email;
        } else {
          alert("❌ Error updating admin: " + result.message);
        }
      } catch (error) {
        console.error("❌ Admin Update Error:", error);
        alert("❌ Failed to update admin");
      }

      modal.style.display = "none";
    };
  }

  // Initialize everything
  fetchAdminDetails();
  fetchTotalStudents();
  fetchTotalProjects();
  fetchTotalJudge();
  fetchStudents();
  updateLayout();
  setupProfileModal();

  // Sidebar toggle
  const toggleButton = document.getElementById("toggleSidebarButton");
  if (toggleButton) {
    toggleButton.addEventListener("click", function () {
      document.getElementById("sidebar").classList.toggle("collapsed");
      updateLayout();
    });
  }
});

// Function to create a project card
function createProjectCard(project) {
  const card = document.createElement("div");
  card.classList.add("project-card");

  const title = document.createElement("h2");
  title.textContent = project.projectName;

  const description = document.createElement("p");
  description.textContent = project.description;

  const details = document.createElement("div");
  details.classList.add("details");
  details.innerHTML = `
    <strong>Leader:</strong> ${project.leaderName}<br>
    <strong>Email:</strong> ${project.email}<br>
    <strong>Technologies:</strong> ${project.technologies.join(", ")}<br>
    <strong>Elevator Pitch:</strong> ${project.elevatorPitch}
  `;

  const scores = document.createElement("div");
  scores.classList.add("scores");
  scores.innerHTML = `
    <div><strong>Ideation Score:</strong> ${project.ideationScore}</div>
    <div><strong>Modularity Score:</strong> ${project.modularityScore}</div>
    <div><strong>Status:</strong> ${project.finalStatus}</div>
  `;

  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(details);
  card.appendChild(scores);

  return card;
}
