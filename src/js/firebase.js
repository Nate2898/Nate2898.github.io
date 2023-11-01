import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, signOut , signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, ref, set, get} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { getFirestore, addDoc, collection, query, getDocs , onSnapshot} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx2rTtPGbVVzbmgxzYFPya2iBdNE0Eekg",
  authDomain: "webportfolio-2db40.firebaseapp.com",
  databaseURL: "https://webportfolio-2db40-default-rtdb.firebaseio.com",
  projectId: "webportfolio-2db40",
  storageBucket: "webportfolio-2db40.appspot.com",
  messagingSenderId: "931794662949",
  appId: "1:931794662949:web:e41ec541818f5dfc1531cc"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Realtime Database
const db = getDatabase(app);

// Firestore
const firestore = getFirestore(app);

// Authentication
const auth = getAuth(app);

//consts setup to link to html ids
const messageContainer = document.getElementById("message-form");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const loginButton = document.getElementById("login-button");
const loginFormPop = document.getElementById("login-form-pop");
const registerForm = document.getElementById("registration-form"); 
const spinnerLoader = document.getElementById("spinner");//added after documentation 

//let is choosen to allow for changes
let messages = []; //array that will hold all messages
let specifiedUsername = ""; //username of the user when logged in
let userLoggedIn = false; //set to false by default as no user is logged in so certain areas are hidden

//when id registerButton is clicked it retrieves the email, password and username from the html ids and attempts to create a user
registerButton.addEventListener("click", async (e) => {
  registerButton.textContent = "Loading...";
  registerButton.disabled = true; //disables button to stop spamming //added after documentation
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const username = document.getElementById("register-username").value;
 //sets the patterns for each input to the follow regexs
  const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const usernamePattern = /^(?=(?:\w*\s?){0,2}\w*$)[\w\s]{4,12}$/
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  //checks if username input match the regex
  if(!username.match(usernamePattern)){
    alert("Please enter a valid username");
    registerButton.textContent = "Register";
    registerButton.disabled = false; //added after documentation // enables the button again
    return;
  }
//checks if email input match the regex
if (!email.match(emailPattern)) {
  alert("Please enter a valid email address");
  registerButton.textContent = "Register";
  registerButton.disabled = false; //added after documentation // enables the button again
  return;
}//checks if password input match the regex
if (!password.match(passwordPattern)) {
  alert("Password must contain at least 8 characters, 1 uppercase, 1 lowercase and 1 number");
  registerButton.textContent = "Register";
  registerButton.disabled = false; 
  return;
}
  try {//attempts to create a user with the email and password 
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    spinnerLoader.style.zIndex = "3"; //shows the spinner
    const user = userCredential.user;
    //sets the username and email to the realtime database
    await set(ref(db, 'users/' + user.uid), {
      username: username,
      email: email
    });
    //removes inputs text and hides the registration form
    registerButton.disabled = false;//added after documentation
    registerButton.textContent = "Register";
    alert("User Created");
    document.getElementById("register-email").value = "";
    document.getElementById("register-password").value = "";
    document.getElementById("register-username").value = "";
    registerForm.classList.remove("show");
    spinnerLoader.style.zIndex = "-1";  //hides the spinner
  } catch (error) {
    registerButton.disabled = false;//added after documentation
    registerButton.textContent = "Register";
    const errorMessage = error.message;
    alert(errorMessage);
    spinnerLoader.style.zIndex = "-1";  //hides the spinner
  }
});

//when id loginBtn is clicked it retrieves the email and password from the html ids and attempts to sign in
loginBtn.addEventListener("click", async (e) => {
  loginBtn.textContent = "Loading...";
  spinnerLoader.style.zIndex = "3"; //shows the spinner
  loginBtn.disabled = true; //disables button to stop spamming //added after documentation
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    //retrieves the username from the database and sets it to specifiedUsername
    const userRef = ref(db, 'users/' + auth.currentUser.uid);
    const userSnapshot = await get(userRef);
    //if the user exists set the username to specifiedUsername
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      specifiedUsername = userData.username;
      console.log("User's username: " + specifiedUsername);
    }
    //calls the functions to load the historical messages and subscribe to new messages
     await Promise.all([loadHistoricalMessages(), subscribeToNewMessages()]);
    writeMessagesArray();
    //stores the userLoggedIn, userUID and username in local storage
    localStorage.setItem('userLoggedIn', true);
    localStorage.setItem('userUID', auth.currentUser.uid);
    localStorage.setItem('username', specifiedUsername);
    spinnerLoader.style.zIndex = "-1"; //hides the spinner
    //update the UI to reflect the users login status
    
    loginBtn.disabled = false; //added after documentation
    userLoggedIn = true;
    console.log("User logged-in");
    loginFormPop.classList.remove("show");
    loginFormPop.style.display = "none";
    logoutButton.style.display = "block";
    loginBtn.textContent = "Logged In";
    messageContainer.style.display = "flex";
    loginButton.style.display = "none";
    scrollToBottom();
    
  } catch (error) {
    spinnerLoader.style.zIndex = "-1";  //hides the spinner
    loginBtn.disabled = false;  //added after documentation
    loginBtn.textContent = "Login";
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Login failed " + errorCode);
    console.error(errorCode, errorMessage);
  }
});

//loads chat content when the page is loaded //added after documentation
window.addEventListener('load', () => {
  //checks if the user was previously logged in
  const storedUserLoggedIn = localStorage.getItem('userLoggedIn');

  if (storedUserLoggedIn === 'true') {
    //changes userLoggedIn to true
    userLoggedIn = true;

    //retrieve the user UID and username from local storage
    const storedUID = localStorage.getItem('userUID');
    const storedUsername = localStorage.getItem('username');

    specifiedUsername = storedUsername;

    //loads the chat content if userLoggedIn is true
    if (userLoggedIn) {
      Promise.all([loadHistoricalMessages(), subscribeToNewMessages()]);
      writeMessagesArray();
    }

     //update the UI to reflect the users login status
    if (userLoggedIn) {
      loginBtn.disabled = false; //added after documentation
      userLoggedIn = true;
      console.log("User logged-in");
      loginFormPop.classList.remove("show");
      loginFormPop.style.display = "none";
      logoutButton.style.display = "block";
      loginBtn.textContent = "Logged In";
      messageContainer.style.display = "flex";
      loginButton.style.display = "none";
      scrollToBottom();
    }
  } else{
    //if user is not logged in, hide the logout button and message container
    logoutButton.style.display = "none";
    messageContainer.style.display = "none";
    console.log("User is not logged in");
  }
});

//if user is logged in it retrieves the uid of that user
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = auth.currentUser.uid; 
    console.log(uid)
  } else {
    console.log("User is not logged in");
  }
});


//when id logoutButton is clicked it signs out the user and updates the UI to reflect the users login status
logoutButton.addEventListener("click", () => {
  loginButton.disabled = true; //added after documentation //disables the login button to stop spamming
  signOut(auth).then(() => {
    alert("User Logged Out");
    userLoggedIn = false;
    logoutButton.style.display = "none";
    loginBtn.textContent = "Login";
    loginButton.style.display = "flex";
    messageContainer.style.display = "none";
    logoutButton.style.display = "none";
    specifiedUsername = "";
    console.log(specifiedUsername)
    loginButton.disabled = false; //added after documentation //enables the login button again
    //added after documentation //removes the userLoggedIn, userUID and username from local storage
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userUID');
    localStorage.removeItem('username');

  }).catch((error) => {
    console.log(error);
    loginButton.disabled = false; //added after documentation //enables the login button again
  });
});


function scrollToBottom() {
  chatsView.scrollTop = chatsView.scrollHeight; //scrolls to the bottom of the chat when called
}

//when id sendButton is clicked it sends the message from the input box to the database
sendButton.addEventListener("click", async () => {
  const message = messageInput.value;
  if (message != ""){ //checks if message is empty
    
  messageInput.value = ""; //removes text in the message box after sending
  const docRef = await addDoc(collection(firestore , "messages"), {
    user: specifiedUsername,
    message: message,
    created: new Date(),
    
  });
  scrollToBottom();
  console.log(docRef);}
  else{
    alert("Please enter a message"); //if message is empty, alert pops up
  }
});

//load messages when the page is ready
document.addEventListener("DOMContentLoaded", () => {
  loadHistoricalMessages();
  subscribeToNewMessages();
  scrollToBottom();
});

const maxMessageCount = 20; //limits the number of displayed messages

function subscribeToNewMessages() {
  const q = query(collection(firestore, "messages")); //query to get all messages from the database
  onSnapshot(q, (querySnapshot) => {
    const newMessages = []; //array for new messages
    querySnapshot.forEach((doc) => { //loops through all messages and pushes them to the newMessages array
      newMessages.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    //hash map is created to keep track of existing messages using the id and loops through existing messages 
    let existingMessageHash = {};
    for (let message of messages) {
      existingMessageHash[message.id] = true;
    }
    //if none of existing id exists, its a new message 
    for (let message of newMessages) {
      if (!existingMessageHash[message.id]) {
        messages.push(message);
      }
    }

    //sort the messages by the 'created' timestamp in ascending order (oldest to newest)
    messages.sort((a, b) => a.created.toDate() - b.created.toDate());

    writeMessagesArray();
  });
  
}

//loads the history of messages from the database
async function loadHistoricalMessages() {
  try {
    messages = []; //clears the messages array to prevent duplicates //added after documentation
    //fetch all  messages from the database in messages collection
    const querySnapshot = await getDocs(collection(firestore, "messages"));
    querySnapshot.forEach((doc) => {//loops through each message(document)
      //each document gets a messageData object with the id and data
      const messageData = {
        id: doc.id,
        ...doc.data(),
      };
      messages.push(messageData);//pushes the messageData to the messages array
    });

    //sorts the messages by the created timestamp in ascending order (oldest to newest)
    messages.sort((a, b) => a.created.toDate() - b.created.toDate());

    writeMessagesArray();
    
  } catch (error) {
    console.error("Error loading historical messages:", error);
  }
}


//writes the messages to the chat
function writeMessagesArray() {
  if (messages.length > maxMessageCount) {
    const startIndex = messages.length - maxMessageCount; //calculate the start index for slicing
    messages = messages.slice(startIndex); //remove the oldest messages thats more than the maxMessageCount
  }
  //html array is used to store the visual messages after pushing through the messageTemplate 
  const html = [];
  for (let message of messages) {
    html.push(messageTemplate(message.message, message.user, message.created));
  }
  //pushes the html array to the messageList id in the html
  const messageList = document.getElementById("messageList");
  messageList.innerHTML = html.join("");
  //scrolls to the bottom of the chat
  messageList.scrollTop = messageList.scrollHeight;
}


//template for how messages are displayed in the chat
function messageTemplate(message, username, timestamp) {//
  return `<li>
    <div>
      <div>
        <div class="user-date">
          <b><div>${username}</div></b>
          <p3 class="time-posted">Time Posted:</p3>
          <div class="time-date">${
            new Date(timestamp.seconds * 1000).toLocaleDateString() +
            " " +
            new Date(timestamp.seconds * 1000).toLocaleTimeString()
          }</div>
        </div>
        <div>${message}</div>
      </div>
    </div>
  </li>`;
}

