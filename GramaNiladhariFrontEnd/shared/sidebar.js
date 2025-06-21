// Common Sidebar Component for Village Management System
// This script generates the sidebar navigation with correct relative paths

function createSidebar() {
  const currentPath = window.location.pathname;
  const currentFile = window.location.href;

  // Determine the base path based on current location
  let basePath = "../";

  // Check if we're in the root GramaNiladhariFrontEnd directory
  if (
    currentPath.endsWith("/GramaNiladhariFrontEnd/") ||
    (currentPath.includes("GramaNiladhariFrontEnd") &&
      !currentPath.includes("/complain/") &&
      !currentPath.includes("/person/") &&
      !currentPath.includes("/land/") &&
      !currentPath.includes("/house/") &&
      !currentPath.includes("/fund/") &&
      !currentPath.includes("/event/") &&
      !currentPath.includes("/registor/"))
  ) {
    basePath = "./";
  }

  // Navigation items with their corresponding paths and current page detection
  const navItems = [
    {
      path: "complain/index.html",
      icon: "fas fa-exclamation-triangle",
      label: "Complain",
      key: "complain",
    },
    {
      path: "event/index.html",
      icon: "fas fa-calendar-alt",
      label: "Event",
      key: "event",
    },
    {
      path: "fund/index.html",
      icon: "fas fa-money-bill-wave",
      label: "Fund",
      key: "fund",
    },
    {
      path: "house/index.html",
      icon: "fas fa-home",
      label: "House",
      key: "house",
    },
    { path: "land/index.html", icon: "fas fa-map", label: "Land", key: "land" },
    {
      path: "person/index.html",
      icon: "fas fa-users",
      label: "Person",
      key: "person",
    },
    {
      path: "registor/index.html",
      icon: "fas fa-user-plus",
      label: "Register",
      key: "registor",
    },
  ];

  let sidebarHTML = "<h4>Village Management</h4>";

  navItems.forEach((item) => {
    const href = basePath + item.path;
    const isActive =
      currentFile.includes(`/${item.key}/`) ||
      currentFile.includes(`${item.key}/index.html`);
    const activeClass = isActive ? " active" : "";

    sidebarHTML += `
            <a href="${href}" class="nav-item${activeClass}" data-page="${item.key}">
                <i class="${item.icon}"></i>${item.label}
            </a>
        `;
  });

  return sidebarHTML;
}

// Function to initialize sidebar on page load
function initializeSidebar() {
  const sidebarElement = document.querySelector(".sidebar");
  if (sidebarElement) {
    sidebarElement.innerHTML = createSidebar();

    // Add click event listeners for navigation
    const navItems = sidebarElement.querySelectorAll(".nav-item");
    navItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        // Remove active class from all items
        navItems.forEach((nav) => nav.classList.remove("active"));
        // Add active class to clicked item
        this.classList.add("active");
      });
    });
  }
}

// Function to navigate between pages (for dynamic content loading if needed)
function navigateTo(page) {
  const basePath = "../";
  const pagePath = `${basePath}${page}/index.html`;
  window.location.href = pagePath;
}

// Function to highlight current page in navigation
function highlightCurrentPage() {
  const currentPath = window.location.href;
  const navItems = document.querySelectorAll(".sidebar .nav-item");

  navItems.forEach((item) => {
    item.classList.remove("active");
    const href = item.getAttribute("href");
    if (currentPath.includes(href.replace("../", "").replace("./", ""))) {
      item.classList.add("active");
    }
  });
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeSidebar();
  setTimeout(highlightCurrentPage, 100); // Small delay to ensure DOM is fully loaded
});

// Export for manual initialization if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createSidebar,
    initializeSidebar,
    navigateTo,
    highlightCurrentPage,
  };
}
