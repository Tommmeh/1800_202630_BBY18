const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    html.setAttribute("data-bs-theme", savedTheme);
}

// Theme toggle
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const currentTheme = html.getAttribute("data-bs-theme");

        html.setAttribute(
            "data-bs-theme",
            currentTheme === "dark" ? "light" : "dark"
        );

        localStorage.setItem(
            "theme",
            html.getAttribute("data-bs-theme")
        );
    });
}