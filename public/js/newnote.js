

document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.your-note');
    // Focus the content area when the page loads
    content.focus();
});

//listens for save-note to be clicked then executes the function
document.getElementById('save-note').addEventListener('click', async function(e) {
    e.preventDefault();
    //gets the element ids and sets them to the variables
    const titleInput = document.getElementById('title-input');
    const noteInput = document.getElementById('your-note');
    const title = titleInput.value;
    const note = noteInput.innerText;

    //checks if title is empty if so it shows custom validation message
    if (title.trim().length < 5) {
        titleInput.setCustomValidity('A Title with 5 Characters is required.');
        titleInput.reportValidity();
        return;
    }
    if (note.trim().length < 1) {
        showToast('A Note is required.', 'dc3545');     
        return;
    }
    //tries to post the note to the server
    try {
        const token = localStorage.getItem('token');
        // const response = await fetch('http://localhost:3000/api/notes', {
        const response = await fetch('https://nate2898-github-io.onrender.com/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${token}` //checks the token from the local storage, then the server checks if it is valid
                
            },
            //saves the note in the json format with values from title and note
            body: JSON.stringify({ title, note })
        });
        //checks if the response status is 200
        if (response.status === 200) {
            //takes the response 200 from the server and sets it to the newNote  
            const newNote = await response.json();
            //takes the id from the response and sets it to the newNoteId
            const newNoteId = newNote._id; 
            //loads the user to the editnote page with there newly created note
            window.location.href = `editnote.html?id=${newNoteId}#new`; 
        
        } else {
            showToast(response.statusText, 'dc3545');
        }
    } catch (error) {
        console.error('Error saving note:', error);
        showToast(`Server Unreachable: ${error}`, 'dc3545');
    }
});

const logoutBar = document.getElementById('logout');
const barLogin = document.getElementById('bar-login');

let sortOrder = 'newest';
let notesArray = [];
import { userExport } from "./sidepanel.js";

//reloads the notes when the reload button is clicked
document.getElementById('reloadnotes').addEventListener('click', loadNotes); 

//loads notes from the server and displays them in the note list
async function loadNotes() {
    // Start spinner immediately
    document.getElementById('spinner').querySelector('.path').style.animation = '';
    document.getElementById('spinner').querySelector('.path').style.stroke = '';
    document.getElementById('spinner').style.zIndex = 7;
    document.getElementById('spinner').style.display = 'block';

    // Set a 5-second delay for showing the "Loading server" popup
    const loadingPopupTimeout = setTimeout(() => {
        document.getElementById('loading-popup').style.display = 'flex';
    }, 5000);

    try {
        const token = localStorage.getItem('token');
        // const response = await fetch('http://localhost:3000/api/notes', {
        const response = await fetch('https://nate2898-github-io.onrender.com/api/notes', {
            method: 'GET',
            headers: {
                'x-auth-token': `${token}`
            }
        });
        const notes = await response.json();

        // Clear the popup timeout if the notes load within 5 seconds
        clearTimeout(loadingPopupTimeout);
        document.getElementById('loading-popup').style.display = 'none';

        if (notes.message === 'Token has expired! Please login again') {
            showToast(notes.message, 'dc3545');
            logoutBar.style.display = 'none';
            barLogin.style.display = 'block';
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            document.getElementById('spinner').querySelector('.path').style.animation = 'none';
            document.getElementById('spinner').querySelector('.path').style.stroke = '#dc3545';
            userExport();
            return;
        } else if (response.status !== 200) {
            console.error('Invalid ID');
            showToast(notes.message, 'dc3545');
            document.getElementById('spinner').querySelector('.path').style.animation = 'none';
            document.getElementById('spinner').querySelector('.path').style.stroke = '#dc3545';
            return;
        }

        // Store the notes and display them
        notesArray = notes;
        displayNotes();
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast(`Server Unreachable: ${error}`, 'dc3545');
        document.getElementById('spinner').querySelector('.path').style.animation = 'none';
        document.getElementById('spinner').querySelector('.path').style.stroke = '#dc3545';

        // Clear the popup timeout in case of error
        clearTimeout(loadingPopupTimeout);
        document.getElementById('loading-popup').style.display = 'none';
    }
}



document.getElementById('text-style').addEventListener('click', () => {
    if (document.getElementById('style-buttons').style.display === 'block') {
        document.getElementById('style-buttons').style.display = 'none';
        document.getElementById('text-style').style.width = '100%';
        document.getElementById('text-style').style.position = 'relative';
        document.getElementById('text-style').style.boxShadow = 'none';
        return;
    }
    document.getElementById('style-buttons').style.display = 'block';
    document.getElementById('text-style').style.width = '10%';
    document.getElementById('text-style').style.position = 'absolute';
    document.getElementById('text-style').style.left = '0';
    document.getElementById('text-style').style.boxShadow = 'inset rgb(0, 0, 0) 0px 0px 2px 2px';
});

//start of the notes becoming displayed
function displayNotes() {
    const notesList = document.getElementById('note-list'); //sets the notes list to the note-list element
    document.getElementById('spinner').style.display = 'none';
    if (!notesList) {
        console.error('Note list element not found');
        return;
    }
    //sorts the notes based on the sortOrder
    notesArray.sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        } else {
            return new Date(a.updatedAt) - new Date(b.updatedAt);
        }
    });

    function noteTemplate(note) {
        return `
            <li class="note">
                <a href="editnote.html?id=${note._id}" class="note-link">
                    <span class="note-name">${note.title}</span>
                    <span class="note-date">${new Date(note.updatedAt).toLocaleString()}</span>
                </a>
                <a href="#delete${note._id}" class="trash-link" data-id="${note._id}" data-title="${note.title}"><i id="trash" class="bi bi-trash"></i></a>
            </li>
        `;
    }
    //add the notes array to the html note list
    notesList.innerHTML = notesArray.map(noteTemplate).join('');
    addDeleteEventListeners();
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
    const toastElement = document.createElement('div'); //creates a new div element for stackable toasts
    toastElement.innerHTML = toastTemplate(message, color);
    toastContainer.appendChild(toastElement); //adds a stackable toast message to the toast container
    const myToast = new bootstrap.Toast(toastElement.querySelector('.toast')); //activates the toaster 🍞
    myToast.show();
}
document.getElementById('inline-button').addEventListener('click', () => {
    sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest'; //toggle between newest and oldest
    document.getElementById('inline-button').textContent = sortOrder === 'newest' ? 'Newest' : 'Oldest'; //change the button text based on the current sort order
    displayNotes(); //change this displayNote based on the current sort order
});

//function to add event listeners to the all delete buttons
function addDeleteEventListeners() {
    document.querySelectorAll('.trash-link').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault(); //prevents the default action of the event from happening 
            showDeletePopup(link.dataset.id, link.dataset.title); //shows the delete popup with the note id and title
        });
    });
}
//function to show the delete confirm popup
function showDeletePopup(noteId, noteTitle) {
    document.getElementById('note-title').textContent = `${noteTitle}`; //sets the popup note title to the note title
    const deletePopupBox = document.getElementById('delete-popup-box'); //gets the delete popup box
    deletePopupBox.style.display = 'block'; //displays the  popup

    document.getElementById('confirm-delete').onclick = () => deleteNote(noteId);
     //if the user clicks the confirm delete button it set to be deleted in the deleteNote function
    document.getElementById('cancel-delete').onclick = hideDeletePopup;
    //if the user clicks the cancel delete button it hides the popup
}
//used to hide the delete popup
function hideDeletePopup() {
    document.getElementById('delete-popup-box').style.display = 'none';
}
//takes the note id and deletes it from the server using the fetch url with delete method
async function deleteNote(noteId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://nate2898-github-io.onrender.com/api/notes/${noteId}`, { 
            method: 'DELETE' ,
            headers: {
            'x-auth-token': `${token}` //checks the token from the local storage, then the server checks if it is valid
            }
        });
        const result = await response.json();
        //reload the notes after deleting the note and hide the popup
        hideDeletePopup();//hides the delete popup
        loadNotes(); //reloads the notes
        if(result.message === 'Note not found'){
            showToast(result.message, 'dc3545');
        }else if(result.success === true){
            showToast(result.message, '28a745');
        }else{
            showToast(result.message, 'dc3545');
        }
        
         //catches any errors and logs them to the console and shows a toast message
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast(`Server Unreachable: ${error}`, 'dc3545');
    }
}

loadNotes();
