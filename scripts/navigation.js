const hamButton = document.getElementById("ham-btn");
const navMenu = document.getElementById("nav-menu");

hamButton.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  hamButton.classList.toggle("open");
});
