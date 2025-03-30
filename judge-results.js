document.addEventListener("DOMContentLoaded", async function () {
    const rankingSection = document.getElementById("ranking-section");
    const rankingsList = document.getElementById("rankings-list");

    async function fetchResults() {
        try {
            const response = await fetch("http://localhost:5000/api/judge/results", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Failed to fetch results");

            const data = await response.json();
            updateRankings(data.projects);
        } catch (error) {
            console.error("Error fetching results:", error);
            rankingsList.innerHTML = "<p>Error loading rankings.</p>";
        }
    }

    function updateRankings(projects) {
        rankingsList.innerHTML = "";
        projects.sort((a, b) => b.totalScore - a.totalScore);

        updateRankingCard("first-place", projects[0] || null);
        updateRankingCard("second-place", projects[1] || null);
        updateRankingCard("third-place", projects[2] || null);

        projects.forEach((project, index) => {
            const rankItem = document.createElement("div");
            rankItem.classList.add("rank");
            rankItem.innerHTML = `
                <p>🥇 ${project.name} <span class="team-tag">${project.team}</span></p>
                <p>${project.totalScore}/50</p>
            `;
            rankingsList.appendChild(rankItem);
        });
    }

    function updateRankingCard(place, project) {
        document.getElementById(`${place}-name`).innerText = project ? project.name : "N/A";
        document.getElementById(`${place}-team`).innerText = project ? project.team : "N/A";
        document.getElementById(`${place}-score`).innerText = project ? `${project.totalScore}/50` : "0/50";
        
        const criteriaList = document.getElementById(`${place}-criteria`);
        criteriaList.innerHTML = project
            ? Object.entries(project.criteria).map(([key, value]) => `<li>${key} <span>${value}/10</span></li>`).join("")
            : "";
    }

    fetchResults();
});
