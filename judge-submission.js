document.addEventListener("DOMContentLoaded", async function () {
    const projectsContainer = document.getElementById("projects-container");

    const projects = [
        {
            teamName: "Team Alpha",
            institution: "XYZ University",
            projectName: "AI Research for Healthcare",
            projectDescription: "An AI-based solution to improve healthcare diagnostics.",
            technologiesUsed: ["Python", "TensorFlow", "Keras"],
            submissionStatus: "Pending",
            files: ["file1.zip", "file2.jpg"],
            teamMembers: ["John Doe", "Jane Smith", "Mike Johnson"]
        },
        {
            teamName: "Code Ninjas",
            institution: "Niagara College",
            projectName: "Smart City Traffic Management",
            projectDescription: "A traffic management system using real-time data for smart cities.",
            technologiesUsed: ["Node.js", "MongoDB", "Express"],
            submissionStatus: "Evaluated",
            files: ["file3.zip", "file4.pdf"],
            teamMembers: ["Alice", "Alex", "Ameen"]
        },
        {
            teamName: "REXO",
            institution: "RCHM",
            projectName: "Robotics Automation for Manufacturing",
            projectDescription: "An automated robotic system to improve manufacturing processes.",
            technologiesUsed: ["C++", "ROS", "OpenCV"],
            submissionStatus: "Finalists",
            files: ["file5.zip", "file6.pdf"],
            teamMembers: ["Beru", "Igriz", "Iron", "Aizen"]
        }
    ];

    function displayProjects(projects) {
        projectsContainer.innerHTML = ""; 

        if (projects.length === 0) {
            projectsContainer.innerHTML = "<p>No projects submitted yet.</p>";
            return;
        }

        projects.forEach(project => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card", project.submissionStatus.toLowerCase());

            projectCard.innerHTML = `
                <h3>${project.projectName}</h3>
                <p><strong>Team:</strong> ${project.teamName}</p>
                <p><strong>Institution:</strong> ${project.institution}</p>
                <p>${project.projectDescription}</p>
                <div class="tech-stack">
                    ${project.technologiesUsed.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <footer class="card-footer">
                    <span>${new Date().toLocaleDateString()}</span>
                    <button onclick="evaluateProject('${project.teamName}')">Evaluate</button>
                </footer>
            `;

            projectsContainer.appendChild(projectCard);
        });
    }

    window.evaluateProject = function (teamName) {
        alert(`Evaluating project: ${teamName}`);
    };

    displayProjects(projects);
});
