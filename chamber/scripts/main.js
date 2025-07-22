

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("show");
    });

    // Optional: Close nav on outside click
    window.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && e.target !== menuToggle) {
            nav.classList.remove("show");
        }
    });
});


// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    rootElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.querySelector('.icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
    themeToggle.querySelector('.icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Set last modified date
document.getElementById('lastModified').textContent = document.lastModified;
