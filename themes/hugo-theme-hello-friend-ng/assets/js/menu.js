console.log("Menu.js loaded");

// Mobile menu
const menuTrigger = document.querySelector(".menu-trigger");
const menu = document.querySelector(".menu");
const mobileQuery = getComputedStyle(document.body).getPropertyValue("--phoneWidth");
const isMobile = () => window.matchMedia(mobileQuery).matches;

// Initialize menu state
const initMenu = () => {
  if (!menu) return;
  if (isMobile()) {
    menu.classList.add("hidden");
    menuTrigger?.classList.remove("is-active");
  } else {
    menu.classList.remove("hidden");
    menuTrigger?.classList.remove("is-active");
  }
};

// Handle menu trigger click
menuTrigger?.addEventListener("click", (e) => {
  console.log("menuTrigger clicked");
  e.preventDefault();
  e.stopPropagation();
  if (isMobile()) {
    menu?.classList.toggle("hidden");
    menuTrigger.classList.toggle("is-active");
  }
});

// Handle menu item clicks
menu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    if (isMobile()) {
      menu.classList.add("hidden");
      menuTrigger?.classList.remove("is-active");
    }
  });
});

// Handle clicks outside menu
document.addEventListener("click", (e) => {
  console.log("document clicked");
  if (isMobile() && menu && !menu.contains(e.target) && !menuTrigger?.contains(e.target)) {
    menu.classList.add("hidden");
    menuTrigger?.classList.remove("is-active");
  }
});

// Handle window resize
window.addEventListener("resize", initMenu);
