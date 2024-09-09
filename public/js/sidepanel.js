const settingsPopout = document.getElementById('settings-block');
const settingsButton = document.getElementById('settings-button');

const settingsButton2 = document.getElementById('settings-button2');
const settingsPopout2 = document.getElementById('settings-block2');

const mobileMenuButton = document.getElementById('mobile-menu');
const noteTab = document.getElementById('note-tab');

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem('username');
    if (username) {
        console.log(username);
        document.getElementById('username').textContent = username; // Set textContent instead of value
    } else {
        console.error('No username found in localStorage');
    }
});

//settings popout menu
settingsButton.addEventListener('click', () => {
    // console.log('settings button clicked');
    if (settingsPopout.style.display === "block") {// Hide the popout
        settingsPopout.classList.remove("show");
        settingsButton.classList.remove("show");
        settingsButton.style.pointerEvents="none";
        setTimeout(() => {
            settingsPopout.style.display = "none"; 
            settingsButton.style.pointerEvents="auto";
            // console.log('settings button disabled');
        }, 800);
    } else {
        settingsPopout.style.display = "block"; // Show the popout
        setTimeout(() => {
            settingsPopout.classList.add("show");
            settingsButton.classList.add("show");
            
        }, 0);
    }
});

//mobile popout menu
mobileMenuButton.addEventListener('click', () => {
    const icon = mobileMenuButton.querySelector('i');
    if (noteTab.classList.contains('show'))  {
        noteTab.classList.remove("show");
        mobileMenuButton.classList.remove("show");
        settingsPopout.classList.remove("show");
        if (settingsPopout.style.display === "block") {
            settingsPopout.style.display = "none";
        }
        settingsButton.classList.remove("show");
        if (icon.classList.contains('bi-x')) {
            icon.classList.remove('bi-x');
            icon.classList.add('bi-list');
        }
        setTimeout(() => {
            noteTab.classList.remove("show");
        }, 800);
    } else {
        noteTab.style.display = "block";
        if (icon.classList.contains('bi-list')) {
            icon.classList.remove('bi-list');
            icon.classList.add('bi-x');
        }
        setTimeout(() => {
            noteTab.classList.add("show");
            mobileMenuButton.classList.add("show");
        }, 0);
    }
});

settingsButton2.addEventListener('click', () => {
    if (settingsPopout2.style.display === "none") { // Show the popout
        settingsPopout2.style.display = "block";
        setTimeout(() => {
            settingsPopout2.classList.add("show");
            settingsButton2.classList.add("show");
        }, 0);
    } else { // Hide the popout
        settingsPopout2.classList.remove("show");
        settingsButton2.classList.remove("show");
        settingsButton2.style.pointerEvents = "none";
        setTimeout(() => {
            settingsPopout2.style.display = "none";
            settingsButton2.style.pointerEvents = "auto";
        }, 800);
    }
});

