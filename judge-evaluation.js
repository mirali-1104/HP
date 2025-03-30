document.addEventListener("DOMContentLoaded", async function () {
    const projectsContainer = document.getElementById("projects-container");

    async function fetchProjects() {
        try {
            projectsContainer.innerHTML = "<p>Loading projects...</p>";

            const response = await fetch("http://localhost:5000/api/judge/projects", {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const data = await response.json();

            displayProjects(data.projects || []);

        } catch (error) {
            console.error("Error loading projects:", error);
            projectsContainer.innerHTML = "<p style='color: red;'>Error loading projects. Please try again later.</p>";
        }
    }

    function displayProjects(projects) {
        projectsContainer.innerHTML = "";

        if (projects.length === 0) {
            projectsContainer.innerHTML = "<p>No projects submitted yet.</p>";
            return;
        }

        projects.forEach(project => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("card");

            projectCard.innerHTML = `
                <h2>${project.name}</h2>
                <p class="team">${project.team}</p>
                <p>${project.description}</p>
                <div class="tags">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join("")}
                </div>
                <a href="evaluate-project.html?id=${project.id}" class="evaluate-btn">Evaluate</a>
            `;

            projectsContainer.appendChild(projectCard);
        });
    }

    fetchProjects();
});
