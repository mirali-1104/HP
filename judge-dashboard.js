document.addEventListener("DOMContentLoaded", function () {
  const groupsContainer = document.getElementById("groups-container");
  const searchInput = document.getElementById("search-input");
  

  if (!groupsContainer || !searchInput) {
    console.error("Required elements not found in the DOM.");
    return;
  }

  async function fetchStudents() {
    try {
      const response = await fetch("http://localhost:5000/api/students");
      if (!response.ok) throw new Error("Failed to fetch students");

      const students = await response.json();
      console.log("Fetched students:", students); // Log the fetched data

      if (students.length === 0) {
        console.warn("No students found.");
        groupsContainer.innerHTML = "<p>No students available.</p>";
      } else {
        displayStudents(students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      groupsContainer.innerHTML =
        "<p>Error fetching students. Please try again later.</p>";
    }
  }

  function displayStudents(students) {
    groupsContainer.innerHTML = ""; // Clear previous results
    students.forEach(createProjectCard);
  }

  function createProjectCard(student) {
    const card = document.createElement("div");
    card.classList.add("group-card");
    const teamMemberNames = student.teamMembers
      .map((member) => member.name)
      .join(", ");

    card.innerHTML = `
            <h3>${student.teamName}</h3>
            <p><strong>User ID:</strong> ${student.userId}</p>
            <p><strong>Institution:</strong> ${student.institution}</p>
            <p><strong>Category:</strong> ${student.category}</p>
             <p><strong>Team Members:</strong> ${teamMemberNames}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Project Submitted:</strong> ${
              student.projectSubmitted ? "Yes" : "No"
            }</p>
            <p><strong>Registered At:</strong> ${new Date(
              student.registeredAt
            ).toLocaleDateString()}</p>
        `;

    groupsContainer.appendChild(card);
  }

  function filterStudents() {
    const searchTerm = searchInput.value.toLowerCase();
    const cards = groupsContainer.getElementsByClassName("group-card");

    Array.from(cards).forEach((card) => {
      const teamName = card.querySelector("h3").textContent.toLowerCase();
      const institution = card
        .querySelector("p:nth-child(3)")
        .textContent.toLowerCase();
      const category = card
        .querySelector("p:nth-child(4)")
        .textContent.toLowerCase();

      const matchesSearch =
        teamName.includes(searchTerm) ||
        institution.includes(searchTerm) ||
        category.includes(searchTerm);
      card.style.display = matchesSearch ? "block" : "none";
    });
  }

  searchInput.addEventListener("input", filterStudents);
  fetchStudents();
});
