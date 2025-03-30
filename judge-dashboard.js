document.addEventListener("DOMContentLoaded", function() {
    const groupsContainer = document.getElementById("groups-container");

    const demoProjects = [
        {
            _id: "67d7fcc0c730914492ab1b78",
            teamName: "REXO",
            institution: "XYZ University",
            email: "studentteam@gmail.com",
            password: "teamalpha123",
            category: "AI & Machine Learning",
            teamMembers: ["John", "Emma", "Mia"],
            registeredAt: "2025-03-17T10:43:12.509+00:00"
        },
        {
            _id: "67d8921e92cbf224eb989217",
            teamName: "Code Ninjas",
            institution: "Niagara College",
            email: "codeninja@gmail.com",
            password: "password123",
            category: "Software Development",
            teamMembers: ["Alice", "Alex", "Ameen"],
            registeredAt: "2025-03-17T10:43:12.509+00:00"
        },
        {
            _id: "67d8921e92cbf224eb989218", 
            teamName: "REXO",
            institution: "RCHM",
            email: "adhithsc8646@gmail.com",
            password: "#909R89YJL",
            category: "Software Development",
            teamMembers: ["Beru", "Igriz", "Iron", "Aizen"],
            registeredAt: "2025-03-17T10:43:12.509+00:00"
        }
    ];

    function createProjectCard(project) {
        const card = document.createElement("div");
        card.classList.add("group-card");

        card.innerHTML = `
            <h3>${project.teamName}</h3>
            <p><strong>Institution:</strong> ${project.institution}</p>
            <p><strong>Category:</strong> ${project.category}</p>
            <p><strong>Team Members:</strong> ${project.teamMembers.join(", ")}</p>
            <p><strong>Email:</strong> ${project.email}</p>
            <p><strong>Registered At:</strong> ${new Date(project.registeredAt).toLocaleDateString()}</p>
        `;

        groupsContainer.appendChild(card);
    }

    demoProjects.forEach(project => {
        createProjectCard(project);
    });
});