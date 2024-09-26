
const settingsPopout = document.getElementById('settings-block');
const settingsButton = document.getElementById('settings-button');

const settingsButton2 = document.getElementById('settings-button2');
const settingsPopout2 = document.getElementById('settings-block2');

const mobileMenuButton = document.getElementById('mobile-menu');
const noteTab = document.getElementById('note-tab');

const userSettings = document.getElementById('user-settings');

const changeUsername = document.getElementById('change-username');
const changeUnPopup = document.getElementById('change-username-popup');
const cancelUn = document.getElementById('cancel-username');



const changePassword = document.getElementById('change-password');
const changePwPopup = document.getElementById('change-password-popup');
const cancelPw = document.getElementById('cancel-password');
const confirmPW = document.getElementById('confirm-password');

const email = document.getElementById('your-email');
const emailStorage = localStorage.getItem('email');



export function userExport() {
    const username = localStorage.getItem('username');
    const userSettings2 = document.getElementById('user-settings');
    const barLogin2 = document.getElementById('bar-login');
    const logoutButton2 = document.getElementById('logout-button');
    if (username !== null && username.trim() !== "") {  // Check for both null and empty string
        // console.log(username);
        document.getElementById('username').textContent = username;
        settingsSlideDown();
        userSettings2.style.display = "block";
    } else {
        // console.error('No username found in localStorage');
        userSettings2.style.display = "none";
        barLogin2.style.display = 'block';
        logoutButton2.style.display = 'none';
    }
}

function username() {
    const username = localStorage.getItem('username');
    if (username !== null && username.trim() !== "") {  // Check for both null and empty string
        // console.log(username);
        document.getElementById('username').textContent = username;
        settingsSlideDown();
        userSettings.style.display = "block";
    } else {
        // console.error('No username found in localStorage');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    username();
});

//change username
changeUsername.addEventListener('click', () => {
    if (changeUnPopup.style.display = "none"){
    changeUnPopup.style.display = "block";
    }
});

function maskEmail(email) {
    const visiblePart = email.slice(0, 4);
    const maskedPart = '*'.repeat(email.length - 4);
    return visiblePart + maskedPart;
}

//change password
changePassword.addEventListener('click', () => {
    if (changePwPopup.style.display === "none") {
        changePwPopup.style.display = "block";
        email.textContent = maskEmail(emailStorage);
    }
});



confirmPW.addEventListener('click', async function() {
    const oldPW = document.getElementById('old-password').value;
    const newPW = document.getElementById('new-password').value;
    const email = emailStorage;

    if (oldPW === "" || newPW === "") {
        showToast('Please fill in all fields', 'dc3545');
        return;
    }

    try {
        // const response = await fetch('http://localhost:3000/api/auth/change-password', {
        const response = await fetch('https://nate2898-github-io.onrender.com/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ oldPW, newPW, email }) // Include email in the payload
        });
        const result = await response.json();
        if (response.ok) {
            showToast(result.message, '28a745');
            changePwPopup.style.display = "none";
        } else {
            showToast(result.message,'dc3545');
        }
    } catch (error) {
        // console.error('Error changing password:', error);
        showToast(`Server Unreachable: ${error}`, 'dc3545');
    }
});


//toaster
function toastTemplate(message, color) {
    return `
    <div class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#${color}"></rect></svg>
            <strong class="me-auto">${message}</strong>
            <small class="text-body-secondary">just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>
    `;
}

function showToast(message, color) {
    const toastContainer = document.querySelector('.toast-container');
    const toastElement = document.createElement('div'); //creates a new div element for stackable toasts
    toastElement.innerHTML = toastTemplate(message, color);
    toastContainer.appendChild(toastElement); //adds a stackable toast message to the toast container
    const myToast = new bootstrap.Toast(toastElement.querySelector('.toast')); //activates the toaster 🍞
    myToast.show();
}


cancelUn.addEventListener('click', () => {
    changeUnPopup.style.display = "none";
});

cancelPw.addEventListener('click', () => {
    changePwPopup.style.display = "none";
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

function settingsSlideDown() {
    if (!settingsPopout2 || !settingsButton2) {
        // console.error('settingsPopout2 or settingsButton2 is null');
        return;
    }

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
}
// authentication
const token = localStorage.getItem('token');
const popup = document.getElementById('popup-box');
const logoutBar = document.getElementById('logout');
const barLogin = document.getElementById('bar-login');
const logoutButton = document.getElementById('logout-button');

function checkToken() {
    if (!token) {
        popup.style.display = 'block';
        username();
        
    }
}

function loggedIn() {
    if (token) {
        logoutBar.style.display = 'block';
        barLogin.style.display = 'none';
    }
}

function logout() {
    logoutBar.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/public/index.html';
    });
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/public/index.html';
    });
}


logout();
loggedIn();
checkToken();
