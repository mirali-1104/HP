document.addEventListener("DOMContentLoaded", async function () {
  // ✅ Get required DOM elements safely
  const welcomeMsg = document.getElementById("welcome-msg");
  const progressBar = document.querySelector(".progress-fill");
  const progressText = document.getElementById("progress-text");
  const teamName = document.getElementById("team-name");
  const submissionStatus = document.getElementById("submission-status");
  const submissionDeadline = document.getElementById("submission-deadline");
  const teamMembersList = document.getElementById("team-members-list");
  const taskNameInput = document.getElementById("task-name");
  const createTaskBtn = document.getElementById("create-task-btn");
  const recentTasksList = document.getElementById("recent-tasks-list");
  const userBtn = document.getElementById("user-btn");

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    window.location.href = "index.html";
  }

  fetchUserData();

  if (userBtn) {
    userBtn.addEventListener(
      "click",
      () => (window.location.href = "profile.html")
    );
  }

  let teamData = {};
  let tasks = [];
  let progress = 0;

  // ✅ 1. Get logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser || !storedUser.email) {
    alert("❌ No logged-in user found!");
    window.location.href = "login.html"; // Redirect to login
    return;
  }
  const userEmail = storedUser.email;

  // ✅ 2. Fetch user details from API
  async function fetchUserData() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students?email=${userEmail}`
      );
      const student = await response.json();

      console.log("Fetched student data:", student); // Log the fetched data

      if (!response.ok)
        throw new Error(student.msg || "Failed to fetch student details");

      // Log the projectSubmitted status
      console.log("Project Submitted Status (raw):", student.projectSubmitted);

      // Ensure correct mapping
      const submissionStatusValue = student.projectSubmitted
        ? "Submitted"
        : "Not Submitted";
      console.log("Mapped Submission Status:", submissionStatusValue);

      teamData = {
        teamName: student.teamName || "No Team",
        teamMembers: Array.isArray(student.teamMembers)
          ? student.teamMembers
          : [],
        submissionStatus: submissionStatusValue,
        deadline: "Not set by Admin",
        userId: student._id,
      };

      console.log("Updated teamData:", teamData); // Log the updated teamData

      // Update UI elements
      if (teamName) {
        console.log("Updating team name:", teamData.teamName);
        teamName.textContent = teamData.teamName;
      }
      if (submissionStatus) {
        console.log("Updating submission status:", teamData.submissionStatus);
        submissionStatus.textContent = teamData.submissionStatus;
      }
      if (submissionDeadline) {
        submissionDeadline.textContent = `Deadline: ${teamData.deadline}`;
      }

      if (teamMembersList) {
        teamMembersList.innerHTML = teamData.teamMembers
          .map(
            (member) =>
              `<div class="member"><strong>${member.name}</strong> - ${member.role}</div>`
          )
          .join("");
      }

      // Fetch tasks
      await fetchTasks(teamData.userId);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      // alert("⚠️ Failed to load user data. Please try again.");
    }
  }

  // ✅ 3. Fetch and display tasks
  async function fetchTasks(userId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks?userId=${userId}`
      );
      const taskData = await response.json();

      if (!response.ok)
        throw new Error(taskData.msg || "Failed to fetch tasks");

      tasks = taskData;
      updateTaskList();
      updateProgress();
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  }

  // ✅ 4. Update the task list
  function updateTaskList() {
    recentTasksList.innerHTML = "";
    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
      <input type="checkbox" class="task-checkbox" data-task-id="${task._id}" ${
        task.checked ? "checked" : ""
      }>
      <label>${task.name}</label>
    `;
      recentTasksList.appendChild(listItem);
    });
  }

  // ✅ 5. Update progress bar
  function updateProgress() {
    const completedTasks = tasks.filter((task) => task.checked).length;
    progress = (completedTasks / tasks.length) * 100 || 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress.toFixed(0)}%`;
  }

  // ✅ 6. Create a new task
  if (createTaskBtn) {
    createTaskBtn.addEventListener("click", async function () {
      const taskName = taskNameInput?.value.trim();
      if (!taskName) {
        alert("⚠️ Task cannot be empty!");
        return;
      }

      const taskData = {
        userId: teamData.userId,
        name: taskName,
        checked: false,
      };

      try {
        const response = await fetch("http://localhost:5000/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });

        const newTask = await response.json();
        if (!response.ok) throw new Error(newTask.msg || "Failed to add task");

        tasks.push(newTask);
        updateTaskList();
        updateProgress();
        if (taskNameInput) taskNameInput.value = "";
      } catch (error) {
        console.error("❌ Error creating task:", error);
      }
    });
  }

  // ✅ 7. Handle task checkbox updates
  if (recentTasksList) {
    recentTasksList.addEventListener("change", async function (e) {
      if (e.target.classList.contains("task-checkbox")) {
        const taskId = e.target.dataset.taskId;
        const task = tasks.find((t) => t._id === taskId);
        if (!task) return;

        task.checked = e.target.checked;
        updateProgress();

        try {
          await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checked: task.checked }),
          });
        } catch (error) {
          console.error("❌ Error updating task:", error);
        }
      }
    });
  }

  // ✅ 8. Hide welcome message after 2 seconds
  setTimeout(() => {
    if (welcomeMsg) welcomeMsg.style.display = "none";
    const statsSection = document.querySelector(".stats");
    if (statsSection) statsSection.style.display = "flex";
  }, 2000);

  // ✅ Fetch user data on page load
  fetchUserData();

  // ✅ Start polling
  function startPolling() {
    fetchUserData();
    setInterval(fetchUserData, 30000); // Fetch data every 30 seconds
  }

  startPolling();
});
document.getElementById("logout-btn").addEventListener("click", function () {

  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userData"); 


  window.location.href = "index.html";
});
function fetchUserData() {
 
  console.log("Fetching user data...");
}
