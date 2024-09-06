const settingsPopout = document.getElementById('settings-block');
const settingsButton = document.getElementById('settings-button');

const mobileMenuButton = document.getElementById('mobile-menu');
const noteTab = document.getElementById('note-tab');

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
    if (noteTab.style.display === "block") {
        noteTab.classList.remove("show");
        mobileMenuButton.classList.remove("show");
        settingsPopout.classList.remove("show");
        settingsButton.classList.remove("show");
        if (icon.classList.contains('bi-x')) {
            icon.classList.remove('bi-x');
            icon.classList.add('bi-list');
        }
        setTimeout(() => {
            noteTab.style.display = "none";
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

