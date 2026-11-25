document.getElementById("themeToggle").addEventListener("click", function () {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-bs-theme");

    html.setAttribute(
        "data-bs-theme",
        currentTheme === "dark" ? "light" : "dark"
    );
});