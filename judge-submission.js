document.addEventListener("DOMContentLoaded", async function () {
    const projectsContainer = document.getElementById("projects-container");
    const searchInput = document.getElementById("search");
    const statusFilter = document.getElementById("statusFilter");
    let allProjects = []; // Store all projects for filtering

    // Fetch projects from backend
    async function fetchProjects() {
        try {
            const response = await fetch("http://localhost:5000/api/projects"); // Fetch from backend
            allProjects = await response.json();
            displayProjects(allProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            projectsContainer.innerHTML = "<p>Failed to load projects.</p>";
        }
    }

    // Display filtered projects
    function displayProjects(projects) {
        projectsContainer.innerHTML = ""; 

        if (projects.length === 0) {
            projectsContainer.innerHTML = "<p>No projects found.</p>";
            return;
        }

        projects.forEach(project => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");

            projectCard.innerHTML = `
                <h3>${project.projectName}</h3>
                <p><strong>Email:</strong> ${project.email}</p>
                <p>${project.description}</p>
                <p><strong>Status:</strong> ${project.submissionStatus}</p>
                <div class="tech-stack">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <footer class="card-footer">
                    <span>${new Date(project.createdAt).toLocaleDateString()}</span>
                    <button onclick="evaluateProject('${project._id}')">Evaluate</button>
                </footer>
            `;

            projectsContainer.appendChild(projectCard);
        });
    }

    // Search & Filter Projects
    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value.toLowerCase();

        const filteredProjects = allProjects.filter(project =>
            (project.projectName.toLowerCase().includes(searchTerm) ||
             project.description.toLowerCase().includes(searchTerm) ||
             project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))) &&
            (selectedStatus === "all" || project.submissionStatus.toLowerCase() === selectedStatus)
        );

        displayProjects(filteredProjects);
    }

    // Navigate to evaluation page with projectId
    window.evaluateProject = function (projectId) {
        // Redirect to the evaluation page, passing the project ID in the URL
        window.location.href = `/evaluation?projectId=${projectId}`;
    };

    // Event Listeners for Search and Filter
    searchInput.addEventListener("input", filterProjects);
    statusFilter.addEventListener("change", filterProjects);

    fetchProjects(); // Fetch and display projects on page load
});
