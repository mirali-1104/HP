document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleBtn");
    const menuItems = document.querySelectorAll(".sidebar-menu li");
    const content = document.querySelector(".content");
    const topBar = document.querySelector(".top-bar");
    const notificationIcon = document.querySelector(".notification-icon");
    const logoutLink = document.querySelector(".logout"); 

    // Function to update layout based on sidebar state
    function updateLayout() {
        if (sidebar.classList.contains("collapsed")) {
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

    updateLayout();

    // Toggle Sidebar
    toggleBtn.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");

        toggleBtn.innerHTML = sidebar.classList.contains("collapsed")
            ? '<i class="fa fa-angle-right"></i>' 
            : '<i class="fa fa-angle-left"></i>'; 

        updateLayout();
    });

    // Active State Change on Click
    menuItems.forEach((item) => {
        item.addEventListener("click", function () {
            document.querySelector(".sidebar-menu .active")?.classList.remove("active");
            item.classList.add("active");
        });
    });

    //  Logout Confirmation for <a> Tag
    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault(); 

            const confirmLogout = confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("✅ Logged out successfully!");
                window.location.href = "index.html"; 
            }
        });
    }
});
