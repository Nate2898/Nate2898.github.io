let sortOrder = 'newest';
let notesArray = [];

const logoutBar = document.getElementById('logout');
const barLogin = document.getElementById('bar-login');

localStorage.removeItem
//reloads the notes when the reload button is clicked
document.getElementById('reloadnotes').addEventListener('click', loadNotes); 

//loads notes from the server and displays them in the note list
async function loadNotes() {
    try {
        document.getElementById('spinner').querySelector('.path').style.animation = '';
        document.getElementById('spinner').querySelector('.path').style.stroke = '';
        document.getElementById('spinner').style.zIndex = 7;
        document.getElementById('spinner').style.display = 'block';
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/notes',{
            method: 'GET',
            headers: {
                'x-auth-token': `${token}` //checks the token from the local storage, then the server checks if it is valid
            }
        });
        const notes = await response.json();
        // console.log(response);
        //check if the message is token expired and logs the user out
        if(notes.message === 'Token has expired! Please login again'){
            showToast(notes.message, 'dc3545');
            logoutBar.style.display = 'none';
             barLogin.style.display = 'block';
            localStorage.removeItem('token');
            // window.location.href = 'html/login.html';
            document.getElementById('spinner').querySelector('.path').style.animation = 'none';
            document.getElementById('spinner').querySelector('.path').style.stroke = '#dc3545';
            return;
        }
        else if(response.status != 200) {
            console.error('Invalid ID');
            showToast(notes.message, 'dc3545');
            document.getElementById('spinner').querySelector('.path').style.animation = 'none';
            document.getElementById('spinner').querySelector('.path').style.stroke = '#dc3545';
            return;
        }
        
        notesArray = notes; //stores the notes in the array
        displayNotes(); //display notes based on the current sort order
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast(`Server Unreachable: ${error}`, 'dc3545')
        document.getElementById('spinner').querySelector('.path').style.animation = 'none';
        document.getElementById('spinner').querySelector('.path').style.stroke = '#dc3545';
    }
}
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
                <a href="html/editnote.html?id=${note._id}" class="note-link">
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
        const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, { 
            method: 'DELETE' ,
            headers: {
                'x-auth-token': `${token}` //checks the token from the local storage, then the server checks if it is valid
                }
        });
        const result = await response.json();
        //reload the notes after deleting the note and hide the popup
        hideDeletePopup();//hides the delete popup
        loadNotes(); //reloads the notes
        console.log(result);
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
