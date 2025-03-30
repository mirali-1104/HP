document.addEventListener("DOMContentLoaded", async function () {
  const taskInput = document.getElementById("task-name");
  const taskList = document.getElementById("recent-tasks-list");
  const createTaskBtn = document.getElementById("create-task-btn");

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.email) {
    console.error("❌ No logged-in user found!");
    return;
  }

  const userEmail = user.email;

  async function fetchTasks() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks?email=${userEmail}`
      );
      const tasks = await response.json();

      taskList.innerHTML = "";
      tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
                    ${task.name} 
                    <button class="complete-btn" data-id="${task._id}">${
          task.checked ? "✅ Completed" : "Mark as Completed"
        }</button>
                `;
        taskList.appendChild(taskItem);
      });
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  }

  createTaskBtn.addEventListener("click", async function () {
    const taskName = taskInput.value.trim();
    if (!taskName) {
      alert("⚠️ Task cannot be empty!");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, taskName }),
      });

      taskInput.value = "";
      fetchTasks();
    } catch (error) {
      console.error("❌ Error creating task:", error);
    }
  });

  fetchTasks();
});
