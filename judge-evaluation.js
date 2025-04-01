document.addEventListener("DOMContentLoaded", async function () {
    const projectsContainer = document.getElementById("projects-container");

    async function fetchProjects() {
        try {
          projectsContainer.innerHTML = "<p>Loading projects...</p>";
      
          const response = await fetch("http://localhost:5000/api/judge/projects", {
            method: "GET",
            credentials: "include", // Make sure credentials are sent
            headers: {
              "Content-Type": "application/json",
            },
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
                <form class="evaluation-form" data-id="${project.id}">
                    <label>Ideation Score (0-10): <input type="number" name="ideation" min="0" max="10" required></label>
                    <label>Modularity Score (0-10): <input type="number" name="modularity" min="0" max="10" required></label>
                    <button type="submit">Submit Evaluation</button>
                </form>
            `;

            projectsContainer.appendChild(projectCard);
        });
    }

    projectsContainer.addEventListener("submit", async function (event) {
        if (event.target.classList.contains("evaluation-form")) {
            event.preventDefault();
            
            const form = event.target;
            const projectId = form.getAttribute("data-id");
            const ideationScore = form.ideation.value;
            const modularityScore = form.modularity.value;

            try {
                const response = await fetch(`http://localhost:5000/api/projects/evaluate/${projectId}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ideationScore: Number(ideationScore),
                        modularityScore: Number(modularityScore)
                    })
                });

                if (!response.ok) {
                    throw new Error("Failed to submit evaluation");
                }

                alert("Evaluation submitted successfully!");
                form.reset();
                fetchProjects(); // Refresh project list
            } catch (error) {
                console.error("Error submitting evaluation:", error);
                alert("Error submitting evaluation. Please try again.");
            }
        }
    });

    fetchProjects();
});