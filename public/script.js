document.getElementById("edit-project").addEventListener("click", async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/projects/project/${user.email}`
    );
    const project = await response.json();

    if (response.ok) {
      document.getElementById("project-name").value = project.projectName;
      document.getElementById("project-description").value =
        project.description;
      document.getElementById("elevator-pitch").value = project.elevatorPitch;

      technologies = project.technologies || [];
      renderTechList();

      formContainer.style.display = "block";
      submissionMessageDiv.style.display = "none";
    } else {
      alert("❌ Error fetching project details.");
    }
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    alert("❌ Failed to fetch project details.");
  }
});
