document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("projectId");

    // Check if the projectId is passed
    if (!projectId) {
        document.body.innerHTML = "<h2>Error: No project selected for evaluation.</h2>";
        return;
    }

    const projectDetails = document.getElementById("project-details");
    const evaluationForm = document.getElementById("evaluation-form");

    // Fetch project details
    async function fetchProjectDetails() {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`);
            const project = await response.json();

            if (!project.projectName) {
                projectDetails.innerHTML = "<p>Project not found.</p>";
                return;
            }

            projectDetails.innerHTML = `
                <h2>${project.projectName}</h2>
                <p><strong>Email:</strong> ${project.email}</p>
                <p>${project.description}</p>
                <p><strong>Technologies:</strong> ${project.technologies.join(", ")}</p>
            `;
        } catch (error) {
            projectDetails.innerHTML = "<p>Error loading project details.</p>";
        }
    }

    // Submit evaluation form
    evaluationForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const ideationScore = document.getElementById("ideationScore").value;
        const modularityScore = document.getElementById("modularityScore").value;
        const comments = document.getElementById("comments").value;

        try {
            const response = await fetch(`http://localhost:5000/api/projects/evaluate/${projectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ideationScore: Number(ideationScore),
                    modularityScore: Number(modularityScore),
                    comments: comments
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Evaluation submitted successfully!");
                window.location.href = "judge-dashboard.html"; // Navigate to judge-dashboard.html after successful submission
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            alert("Failed to submit evaluation.");
        }
    });

    fetchProjectDetails(); // Load project details when page loads
});
