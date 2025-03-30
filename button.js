document.addEventListener("DOMContentLoaded", function () {
    const addTeamBtn = document.querySelector(".add-team-btn");
    const newProjectBtn = document.querySelector(".new-project-btn");

    addTeamBtn.addEventListener("click", function () {
        window.location.href = "addteam.html";
    });

    newProjectBtn.addEventListener("click", function () {
        window.location.href = "newproject.html";
    });
});
