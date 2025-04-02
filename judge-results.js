document.addEventListener("DOMContentLoaded", async function () {
    const rankingsList = document.getElementById("rankings-list");

    // Elements for top 3 winners
    const firstPlace = {
        name: document.getElementById("first-place-name"),
        team: document.getElementById("first-place-team"),
        score: document.getElementById("first-place-score"),
        criteria: document.getElementById("first-place-criteria"),
    };
    const secondPlace = {
        name: document.getElementById("second-place-name"),
        team: document.getElementById("second-place-team"),
        score: document.getElementById("second-place-score"),
        criteria: document.getElementById("second-place-criteria"),
    };
    const thirdPlace = {
        name: document.getElementById("third-place-name"),
        team: document.getElementById("third-place-team"),
        score: document.getElementById("third-place-score"),
        criteria: document.getElementById("third-place-criteria"),
    };

    // ✅ Fetch project results from backend
    async function fetchProjectResults() {
        try {
            const response = await fetch("http://localhost:5000/api/projects/results", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to fetch results: ${errorMessage}`);
            }
    
            const projects = await response.json();
            console.log("Fetched Data:", projects); // Debugging line
    
            if (!projects || projects.length === 0) {
                rankingsList.innerHTML = "<p>No results available yet.</p>";
                return;
            }
    
            // Sort projects by final score in descending order
            projects.sort((a, b) => b.finalScore - a.finalScore);
    
            // Assign top 3 winners
            if (projects[0]) updateWinner(firstPlace, projects[0]);
            if (projects[1]) updateWinner(secondPlace, projects[1]);
            if (projects[2]) updateWinner(thirdPlace, projects[2]);
    
            // Populate ranking list dynamically
            rankingsList.innerHTML = projects.map((proj, index) => `
                <div class="ranking-item">
                    <span class="rank">#${index + 1}</span>
                    <span class="project-name">${proj.projectName}</span>
                    <span class="score">${proj.finalScore}/50</span>
                </div>
            `).join("");
    
        } catch (error) {
            console.error("Error fetching project results:", error);
            rankingsList.innerHTML = `<p style='color:red;'>Error loading results: ${error.message}</p>`;
        }
    }
    

    // ✅ Function to update winner details
    function updateWinner(element, project) {
        element.name.textContent = project.projectName;
        element.team.textContent = project.teamName || "No team info";
        element.score.textContent = `${project.finalScore}/50`;
        element.criteria.innerHTML = project.criteria 
            ? project.criteria.map(crit => `<li>${crit}</li>`).join("")
            : "<li>No details available</li>";
    }

    // ✅ Fetch results on page load
    fetchProjectResults();
});
