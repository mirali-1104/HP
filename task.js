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
  const userID = localStorage.getItem("userID"); // ✅ Declare userID here

  async function fetchTasks() {
    console.log("🛠 Checking stored userID:", userID); // Debugging

    if (!userID || userID === "null") {
      console.error("❌ No valid user ID found in localStorage");
      return; // Exit function to prevent errors
    }

    try {
     const response = await fetch(
       `http://localhost:5000/api/tasks?userId=${encodeURIComponent(userID)}` // ✅ Change `userID` to `userId`
     );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const tasks = await response.json();
      console.log("✅ Fetched tasks:", tasks);

      taskList.innerHTML = ""; // Clear previous tasks

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.name; // Assuming task object has "name"
        taskList.appendChild(li);
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
     body: JSON.stringify({ userId: userID, name: taskName }), // ✅ Include `userId`
   });

      taskInput.value = "";
      fetchTasks();
    } catch (error) {
      console.error("❌ Error creating task:", error);
    }
  });

  fetchTasks();
});
