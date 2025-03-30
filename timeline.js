document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleBtn");
    const content = document.querySelector(".content");
    const topBar = document.querySelector(".top-bar");

    function updateLayout() {
        const isCollapsed = sidebar.classList.contains("collapsed");

        if (isCollapsed) {
            content.style.marginLeft = "70px";
            content.style.width = "calc(100% - 70px)";
            topBar.style.marginLeft = "70px";
            topBar.style.width = "calc(100% - 70px)";
        } else {
            content.style.marginLeft = "300px";
            content.style.width = "calc(100% - 300px)";
            topBar.style.marginLeft = "300px";
            topBar.style.width = "calc(100% - 300px)";
        }
    }

    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");

        updateLayout();
    });

    updateLayout();
});
