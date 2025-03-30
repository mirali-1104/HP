document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("submit-form");
  const techInput = document.querySelector("#technologies-used input");
  const addTechBtn = document.getElementById("add-tech-btn");
  const techListDiv = document.getElementById("tech-list");

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.email) {
    console.error("❌ No logged-in user found!");
    return;
  }

  const userEmail = user.email;
  let technologies = [];

  // Add technology to list
  addTechBtn.addEventListener("click", () => {
    const tech = techInput.value.trim();
    if (tech && !technologies.includes(tech)) {
      technologies.push(tech);
      renderTechList();
      techInput.value = ""; // Clear input
    }
  });

  // Function to render technologies
  function renderTechList() {
    techListDiv.innerHTML = ""; // Clear old list
    technologies.forEach((tech, index) => {
      const techItem = document.createElement("div");
      techItem.innerHTML = `${tech} <button onclick="removeTech(${index})">Remove</button>`;
      techListDiv.appendChild(techItem);
    });
  }

  // Function to remove technology
  window.removeTech = (index) => {
    technologies.splice(index, 1);
    renderTechList();
  };

  // Form Submission
  submitForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const projectName = document.getElementById("project-name").value.trim();
    const projectDescription = document
      .getElementById("project-description")
      .value.trim();
    const elevatorPitch = document
      .getElementById("elevator-pitch")
      .value.trim();
    const projectFiles = document.getElementById("project-files").files;

    if (!projectName) return alert("Project Name is required.");
    if (!projectDescription) return alert("Project Description is required.");
    if (!projectFiles.length) return alert("Please upload a file.");

    const formData = new FormData();
    formData.append("email", userEmail);
    formData.append("projectName", projectName);
    formData.append("description", projectDescription);
    formData.append("technologies", technologies.join(","));
    formData.append("elevatorPitch", elevatorPitch);
    formData.append("file", projectFiles[0]);

    try {
      const response = await fetch(
        "http://localhost:5000/api/projects/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to submit project");
        return;
      }

      alert("Project submitted successfully!");
      console.log("Project submitted:", data);
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("An error occurred while submitting the project.");
    }
  });
});
