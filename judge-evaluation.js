document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("projectId");

    if (!projectId) {
        document.body.innerHTML = "<h2>Error: No project selected for evaluation.</h2>";
        return;
    }

    const projectDetails = document.getElementById("project-details");
    const evaluationForm = document.getElementById("evaluationForm");

    // ✅ Display loading message before fetching
    projectDetails.innerHTML = "<p>Loading project details...</p>";

    // ✅ Fetch project details from the backend
    async function fetchProjectDetails() {
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`);
            if (!response.ok) throw new Error("Project not found");

            const project = await response.json();

            if (!project || Object.keys(project).length === 0) {
                projectDetails.innerHTML = "<p>Project not found.</p>";
                return;
            }

            // ✅ Ensure the file URL is correct
            const fileUrl = project.fileUrl ? `http://localhost:5000/uploads/${project.fileUrl.split('/').pop()}` : null;
            const fileLink = fileUrl
                ? `<a href="${fileUrl}" target="_blank" download>Download File</a>`
                : "<span style='color:red;'>No file uploaded</span>";

            // ✅ Fill project details dynamically
            projectDetails.innerHTML = `
                <h2>${project.projectName}</h2>
                <p><strong>Leader Name:</strong> ${project.leaderName}</p>
                <p><strong>Email:</strong> ${project.email}</p>
                <p><strong>Description:</strong> ${project.description}</p>
                <p><strong>Elevator Pitch:</strong> ${project.elevatorPitch}</p>
                <p><strong>Technologies:</strong> ${project.technologies.join(", ")}</p>
                <p><strong>Project File:</strong> ${fileLink}</p>
                <p><strong>Ideation Score:</strong> ${project.ideationScore ?? "Not Evaluated"}</p>
                <p><strong>Modularity Score:</strong> ${project.modularityScore ?? "Not Evaluated"}</p>
                <p><strong>Status:</strong> ${project.finalStatus ?? "Pending"}</p>
            `;
        } catch (error) {
            console.error("Error fetching project details:", error);
            projectDetails.innerHTML = "<p style='color:red;'>Error loading project details.</p>";
        }
    }

    // ✅ Submit evaluation form
    evaluationForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const ideationScore = Number(document.getElementById("ideationScore").value);
        const modularityScore = Number(document.getElementById("modularityScore").value);
        const comments = document.getElementById("comments").value.trim();

        // ✅ Validation: Check if all fields are filled correctly
        if (isNaN(ideationScore) || isNaN(modularityScore) || comments === "") {
            alert("❌ Please fill all fields correctly.");
            return;
        }
        if (ideationScore < 0 || ideationScore > 10 || modularityScore < 0 || modularityScore > 10) {
            alert("❌ Scores must be between 0 and 10.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/projects/evaluate/${projectId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ideationScore,
                    modularityScore,
                    comments
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ Evaluation submitted successfully!");
                window.location.href = "judge-dashboard.html"; // ✅ Navigate after successful submission
            } else {
                alert("❌ Error: " + result.error);
            }
        } catch (error) {
            console.error("Error submitting evaluation:", error);
            alert("❌ Failed to submit evaluation.");
        }
    });

    // ✅ Call function to fetch project details on load
    fetchProjectDetails();
});
