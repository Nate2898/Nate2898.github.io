document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.your-note');
    
    // Focus the content area when the page loads
    content.focus();
});

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

const logoutBar = document.getElementById('logout');
const barLogin = document.getElementById('bar-login');

let hasEdit = false;//used to check if the user has edited the note

//loads the note from the server based on the note id in the url
document.addEventListener('DOMContentLoaded', async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const noteId = queryParams.get('id');
    //checks if its a new note and shows a toast message
    if (window.location.hash === '#new') { 
        showToast('Note was saved successfully', '28a745');
        window.location.hash = '';
    }
    //if there is no note id in the url it returns an error
    if (!noteId) {
        console.error('No note ID provided in URL');
        return;
    }
    //uses the id to get the note from the server
    try {
        const token = localStorage.getItem('token');
        // console.log(token);
        const response = await fetch(`http://localhost:3000/api/notes/${noteId}`,{
            method: 'GET',
            headers: {
                'x-auth-token': `${token}` //checks the token from the local storage, then the server checks if it is valid
            }
        });
        console.log(response);
        const note = await response.json();
        if(response.status != 200) {
            console.error('Invalid ID');
            showToast(note.message, 'dc3545');
            return;
        }
        //sets the note title to the title-input value
        document.getElementById('title-input').value = note.title;
        //sets the note to the your-note id 
        document.getElementById('your-note').innerHTML = note.note
            .replace(/\n/g, '<br>') //replaces any empty lines with a <br> tag
            .replace(/  /g, '&nbsp;&nbsp;'); //and any double spaces using the &nbsp;&nbsp; tag     
            //adds event listeners to the title-input and your-note elements
            document.getElementById('title-input').addEventListener('input', () => {
                hasEdit = true;
            });
            document.getElementById('your-note').addEventListener('input', () => {
                hasEdit = true;
            });
            //if the user tries to leave the page without saving the note it will show a popup
            window.addEventListener('beforeunload', (event) => {
                if (hasEdit === true) {
                    event.preventDefault();
                }
            });

    } catch (error) {
        console.error('Error fetching note:', error);
    }
    //adds event listeners to the save-note and deletenote buttons
    document.getElementById('save-note').addEventListener('click', () => {
        saveNote(noteId);
    });
    document.getElementById('deletenote').addEventListener('click', () => {
        showDeletePopup(noteId, document.getElementById('title-input').value);
    })
});

//takes the note id and updates the note with the new title and note
async function saveNote(noteId) {
    const title = document.getElementById('title-input').value;
    const note = document.getElementById('your-note').innerHTML;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': `${token}` //checks the token from the local storage, then the server checks if it is valid
            },
            body: JSON.stringify({
                title: title,
                note: note,
                updatedAt: new Date(),
            }),
        });
        //sets the reponse json to the result
        const result = await response.json();

        if (response.status === 200) {
            console.log(response)
            console.log('Note saved successfully');
            hasEdit = false; //allows the user to leave the page without a popup
            showToast(result.message, '28a745'); //shows the rosponse from the router in a toast with green color
        } else {
            console.error('Error saving note:', response.status);
            showToast(result.message, 'dc3545');//shows the rosponse from the router in a toast with red color
        }
    } catch (error) {
        console.error('Error saving note:', error);
        showToast(`An error occurred while saving the note: ${error}`, 'dc3545'); 
    }
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

let sortOrder = 'newest';
let notesArray = [];

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
                <a href="?id=${note._id}" class="note-link">
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
    hasEdit = false;
     //if the user clicks the confirm delete button it set to be deleted in the deleteNote function
    document.getElementById('cancel-delete').onclick = hideDeletePopup;
    //if the user clicks the cancel delete button it hides the popup
}
//used to hide the delete popup
function hideDeletePopup() {
    document.getElementById('delete-popup-box').style.display = 'none';
}
//used check the url for the a matching note id
function getNoteIdFromUrl() {
    const params = new URLSearchParams(window.location.search);//checks the url for the note id
    return params.get('id');
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
        hideDeletePopup();
        loadNotes();
        if(result.message === 'Note not found'){
            showToast(result.message, 'dc3545');
        }else if(result.success === true){
            showToast(result.message, '28a745');
        }else{
            showToast(result.message, 'dc3545');
        }
        //checks to see if the noteId matches the currentNoteId from the getNoteIdFromUrl function
        const currentNoteId = getNoteIdFromUrl();
        if (currentNoteId === noteId) {
            window.location.href = '../index.html'; //takes the user back to the index page
        }
        //catches any errors and logs them to the console and shows a toast message
    } catch (error) {
        console.error('Error deleting note:', error);
        showToast(`Server Unreachable: ${error}`, 'dc3545');
    }
}

loadNotes();
