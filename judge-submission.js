// Define evaluateProject globally
window.evaluateProject = function (projectId) {
    if (!projectId) {
        console.error("Invalid project ID");
        return;
    }
    console.log("Redirecting to:", `/evaluation?projectId=${projectId}`);
    window.location.href = `/evaluation?projectId=${projectId}`;
};

document.addEventListener("DOMContentLoaded", async function () {
    const projectsContainer = document.getElementById("projects-container");
    const searchInput = document.getElementById("search");
    const statusFilter = document.getElementById("statusFilter");
    let allProjects = [];

    // Fetch projects
    async function fetchProjects() {
        try {
            const response = await fetch("http://localhost:5000/api/projects");
            allProjects = await response.json();
            displayProjects(allProjects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            projectsContainer.innerHTML = "<p>Failed to load projects.</p>";
        }
    }

    // Display projects
    function displayProjects(projects) {
        projectsContainer.innerHTML = "";

        if (projects.length === 0) {
            projectsContainer.innerHTML = "<p>No projects found.</p>";
            return;
        }

        projects.forEach((project) => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");

            projectCard.innerHTML = `
                <h3>${project.projectName}</h3>
                <p><strong>Email:</strong> ${project.email}</p>
                <p>${project.description}</p>
                <p><strong>Status:</strong> ${project.submissionStatus}</p>
                <div class="tech-stack">
                    ${project.technologies.map((tech) => `<span>${tech}</span>`).join("")}
                </div>
                <footer class="card-footer">
                    <span>${new Date(project.createdAt).toLocaleDateString()}</span>
                    <button onclick="evaluateProject('${project._id}')">Evaluate</button>
                </footer>
            `;

            projectsContainer.appendChild(projectCard);
        });
    }

    // Redirect to evaluation page
    window.evaluateProject = function (projectId) {
        if (!projectId) {
            console.error("Invalid project ID");
            return;
        }
        window.location.href = `judge-evaluation.html?projectId=${projectId}`;
    };

    // Filter projects
    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value.toLowerCase();

        const filteredProjects = allProjects.filter(
            (project) =>
                (project.projectName.toLowerCase().includes(searchTerm) ||
                    project.description.toLowerCase().includes(searchTerm) ||
                    project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm))) &&
                (selectedStatus === "all" || project.submissionStatus.toLowerCase() === selectedStatus)
        );

        displayProjects(filteredProjects);
    }

    // Event listeners
    searchInput.addEventListener("input", filterProjects);
    statusFilter.addEventListener("change", filterProjects);

    fetchProjects();
});
