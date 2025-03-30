const projectsGrid = document.getElementById("projects-grid");
const searchInput = document.getElementById("search");
const filterBtn = document.getElementById("filter-btn");

let projectsData = [];

async function fetchProjects(searchTerm = "") {
  try {
    console.log("📡 Fetching projects...");

    const response = await fetch(
      `http://localhost:5000/api/projects?search=${encodeURIComponent(
        searchTerm
      )}`
    );

    console.log("🟡 Response Status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Server responded with ${response.status} (${response.statusText})`
      );
    }

    const data = await response.json();
    console.log("✅ Fetched Data:", data);

    displayProjects(data);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    projectsGrid.innerHTML =
      "<p style='color: red;'>Failed to fetch projects. Please check the API.</p>";
  }
}

function displayProjects(projects) {
  projectsGrid.innerHTML = "";

  if (projects.length === 0) {
    projectsGrid.innerHTML = "<p>No projects found.</p>";
    return;
  }

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("project-card");

    // Extract filename from fileUrl
    const fileName = project.fileUrl.split("/").pop();

    card.innerHTML = `
      <h2>${project.projectName}</h2>
      <p><strong>Description:</strong> ${project.description}</p>
      <p><strong>Technologies:</strong> ${project.technologies.join(", ")}</p>
      <p><strong>Elevator Pitch:</strong> ${project.elevatorPitch}</p>
      <p><strong>Team Email:</strong> ${project.email}</p>
    `;

    projectsGrid.appendChild(card);
  });
}



function filterProjects() {
  const searchTerm = searchInput.value.trim();
  console.log("🔍 Searching for:", searchTerm);
  fetchProjects(searchTerm);
}

document.addEventListener("DOMContentLoaded", () => fetchProjects());
filterBtn.addEventListener("click", filterProjects);
