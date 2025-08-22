document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const mainWrapper = document.getElementById('main-wrapper');
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.querySelector('.openbtn');
    const closeBtn = document.querySelector('.closebtn');
    const servicesToggle = document.querySelector('.services-toggle');
    const submenu = document.querySelector('.submenu');

    // Sidebar functions
    function openNav() {
        if (sidebar) {
            sidebar.style.width = "250px";
        }
        if (mainWrapper) {
            mainWrapper.style.marginLeft = "250px";
        }
    }

    function closeNav() {
        if (sidebar) {
            sidebar.style.width = "0";
        }
        if (mainWrapper) {
            mainWrapper.style.marginLeft = "0";
        }
    }

    // Toggle services submenu
    if (servicesToggle && submenu) {
        servicesToggle.addEventListener('click', function(event) {
            event.preventDefault();
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            servicesToggle.classList.toggle('active');
        });
    }

    // Attach listeners
    if (openBtn) {
        openBtn.addEventListener("click", openNav);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeNav);
    }

    mainContent.style.display = 'block';
});
