const token = localStorage.getItem('token');
const popup = document.getElementById('popup-box');
const logoutBar = document.getElementById('logout');
const barLogin = document.getElementById('bar-login');
const logoutButton = document.getElementById('logout-button');

function checkToken() {
    if (!token) {
        popup.style.display = 'block';
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
        window.location.href = '/public/index.html';
    });
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/public/index.html';
    });
}

logout();
loggedIn();
checkToken();