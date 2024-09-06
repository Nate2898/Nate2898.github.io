//adds submit event listener to the register form, so when the form is submitted it sends a post request to the server with the user data 
const registerForm = document.getElementById('registerForm')
if(registerForm){ //used to check if the register form exists
    registerForm.addEventListener('submit', async function(e){
    e.preventDefault()
    const registerButton = document.getElementById('regbutton');
    //stops the user from clicking the register button multiple times
    registerButton.disabled = true;
    registerButton.textContent = 'Registering...';
    //get the input values from the form
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    //tries to send a post request to the server with the body json data
    try{
    const response = await fetch('http://localhost:3000/api/auth/register',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    //the values that are sent to the server in json format
    body: JSON.stringify({username,email,password})
    })
    //sets any response from the server to result
    const result = await response.json()
    //if the status code is 200 - 299 then the user registered successfully
    if(response.ok){
        console.log("Registered Successfully") 
        showToast('User Registered Successfully', '28a745') //shows the toast message
        localStorage.setItem('token', result.token); //store the token to the local storage
        setTimeout(() => {
            window.location.href = '../index.html'; //redirects the user to the home page
        }, 500);
    //if the status code is not ok the user was not registered successfully
    }else{
        showToast(result.message, 'dc3545') //shows the response message from the server
        registerButton.disabled = false; //reenables the register button
        registerButton.textContent = 'Register';
    }
//catches any other errors that may occur
}catch(err){
    console.error('error registering user:', err)
    showToast(`Server Unreachable: ${err}`, 'dc3545')
    registerButton.disabled = false;
    registerButton.textContent = 'Register';
}
})
}
//adds submit event listener to the login form, so when the form is submitted it sends a post request to the server with the user data
const loginForm = document.getElementById('loginForm')
if(loginForm){ //used to check if the login form exists
    loginForm.addEventListener('submit', async function(e){
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    console.log(email + password)//ensures the email and password values are being captured
    //tries to send a post request to the server with the body json data
    try{
    const response = await fetch('http://localhost:3000/api/auth/login',{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
        body: JSON.stringify({email,password})
        })
        const result = await response.json()

        if(response.ok){
            showToast(result.message, '28a745')
            localStorage.setItem('token', result.token);
            window.location.href = '../index.html';

        }else{
            showToast(result.message, 'dc3545')
        }

    }catch(err){
        console.error('error registering user:', err)
        showToast(`Server Unreachable: ${err}`, 'dc3545')
        registerButton.disabled = false;
        registerButton.textContent = 'Register';
    }
    })
}

//toaster template
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
//function to show the toast message with certain parameters
function showToast(message, color) {
    const toastContainer = document.querySelector('.toast-container');
    toastContainer.innerHTML = toastTemplate(message, color);
    const myToast = new bootstrap.Toast(toastContainer.querySelector('.toast')); //activates the toaster 🍞
    myToast.show();
}