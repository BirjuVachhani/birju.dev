console.log("Menu.js loaded");

// Mobile menu
const menuTrigger = document.querySelector(".menu-trigger");
const menu = document.querySelector(".menu");

// Initialize menu state
const initMenu = () => {
  if (!menu) return;
  menu.classList.add("hidden");
};

// Handle menu trigger click
menuTrigger?.addEventListener("click", (e) => {
  console.log("menuTrigger clicked");
  e.stopPropagation();
  menu?.classList.toggle("hidden");
});

// Handle menu item clicks
menu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.add("hidden");
  });
});

// Handle clicks outside menu
document.addEventListener("click", (e) => {
  console.log("document clicked");
  if (menu && !menu.contains(e.target) && !menuTrigger?.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// Initialize on load
document.addEventListener("DOMContentLoaded", initMenu);
