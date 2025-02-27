let lastScrollY = window.scrollY;
let navbarOffset = 0; // Tracks how much the navbar has moved up
let isScrolling;
const navbar = document.getElementById("topbar");

window.addEventListener("scroll", () => {
    let scrollDelta = window.scrollY - lastScrollY;

    // Scroll down: Move navbar up, but not beyond its full height
    if (scrollDelta > 0) {
        navbarOffset = Math.min(navbarOffset + scrollDelta, navbar.offsetHeight);
    } 
    // Scroll up: Move navbar back down, but not below 0
    else {
        navbarOffset = Math.max(navbarOffset + scrollDelta, 0);
    }

    // Apply the transform to move the navbar
    navbar.style.transform = `translateY(-${navbarOffset}px)`;

    lastScrollY = window.scrollY;

    // Clear the previous timeout if scrolling continues
    clearTimeout(isScrolling);

    // After 2 seconds of no scroll, make the navbar appear
    isScrolling = setTimeout(() => {
        navbarOffset = 0; // Reset to original position
        navbar.style.transform = `translateY(0)`;
    }, 1000); // Adjust the delay (2000ms = 2 seconds)
});
