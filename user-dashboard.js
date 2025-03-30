document.addEventListener("DOMContentLoaded", async function () {
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
  document.getElementById("user-btn").addEventListener("click", function () {
    window.location.href = "profile.html";
  });


  let teamData = {};
  let tasks = [];
  let progress = 0;

  // ✅ 1. Get the logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser || !storedUser.email) {
    alert("❌ No logged-in user found!");
    window.location.href = "login.html"; // Redirect to login if no user
    return;
  }

  const userEmail = storedUser.email;

  try {
    // ✅ 2. Fetch user details from Student collection using email
    const userResponse = await fetch(
      `http://localhost:5000/api/student?email=${userEmail}`
    );
    const student = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(student.msg || "Failed to fetch student details");
    }

    // ✅ 3. Populate team data
    teamData = {
      teamName: student.teamName,
      teamMembers: student.teamMembers,
      submissionStatus: student.projectSubmitted
        ? "Submitted"
        : "Not Submitted",
      deadline: "Not set by Admin", // You can fetch this from the server if available
      userId: student._id, // Store the ObjectId for task fetching
    };

    teamName.textContent = teamData.teamName;
    submissionStatus.textContent = teamData.submissionStatus;
    submissionDeadline.textContent = `Deadline: ${teamData.deadline}`;
    teamMembersList.innerHTML = teamData.teamMembers
      .map((member) => `<div class="member">${member}</div>`)
      .join("");

    // ✅ 4. Fetch tasks assigned to this user
    await fetchTasks(teamData.userId);
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    alert("⚠️ Failed to load user data. Please try again.");
  }

  // ✅ 5. Fetch and display tasks
  async function fetchTasks(userId) {
    try {
      const taskResponse = await fetch(
        `http://localhost:5000/api/tasks?userId=${userId}`
      );
      const taskData = await taskResponse.json();

      if (!taskResponse.ok) {
        throw new Error(taskData.msg || "Failed to fetch tasks");
      }

      tasks = taskData; // Store tasks in the array
      updateTaskList();
      updateProgress();
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  }

  // ✅ 6. Update the task list in UI
  function updateTaskList() {
    recentTasksList.innerHTML = "";
    tasks.forEach((task, index) => {
      recentTasksList.innerHTML += `
        <li>
          <input type="checkbox" class="task-checkbox" data-task-id="${index}" ${
        task.checked ? "checked" : ""
      }>
          ${task.name}
        </li>
      `;
    });
  }

  // ✅ 7. Update progress bar
  function updateProgress() {
    const completedTasks = tasks.filter((task) => task.checked).length;
    progress = (completedTasks / tasks.length) * 100 || 0;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(0)}%`;
  }

  // ✅ 8. Create a new task
  createTaskBtn.addEventListener("click", async function () {
    const taskName = taskNameInput.value.trim();
    if (!taskName) {
      alert("⚠️ Task cannot be empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: teamData.userId,
          name: taskName,
          checked: false,
        }),
      });

      const newTask = await response.json();
      if (!response.ok) {
        throw new Error(newTask.msg || "Failed to add task");
      }

      tasks.push(newTask);
      updateTaskList();
      updateProgress();
      taskNameInput.value = "";
    } catch (error) {
      console.error("❌ Error creating task:", error);
      alert("⚠️ Could not add task. Try again.");
    }
  });

  // ✅ 9. Handle checkbox change
  recentTasksList.addEventListener("change", async function (e) {
    if (e.target.classList.contains("task-checkbox")) {
      const taskId = e.target.dataset.taskId;
      tasks[taskId].checked = e.target.checked;
      updateProgress();

      try {
        await fetch(`http://localhost:5000/api/tasks/${tasks[taskId]._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checked: tasks[taskId].checked }),
        });
      } catch (error) {
        console.error("❌ Error updating task:", error);
      }
    }
  });

  // ✅ 10. Hide welcome message after 2 seconds
  setTimeout(() => {
    welcomeMsg.style.display = "none";
    document.querySelector(".stats").style.display = "flex";
  }, 2000);
});
