

var firebaseConfig = {
    apiKey: "AIzaSyBVnmwD9Vo-3DGB0vu_CqKNyZen1p5PhjQ",
    authDomain: "first-projet-1269c.firebaseapp.com",
    projectId: "first-projet-1269c",
    storageBucket: "first-projet-1269c.appspot.com",
    messagingSenderId: "581316410152",
    appId: "1:581316410152:web:8147eaed08e2b2759f6e1d",
    measurementId: "G-Q7P04DZ3YC"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const signincontainer = document.getElementById('auth-container');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const profilePage = document.getElementById('profile-page');
const signinButton = document.getElementById('signin-button');
const signupButton = document.getElementById('signup-button');
const createAccountButton = document.getElementById('create-account-button');
const backToSigninButton = document.getElementById('back-to-signin-button');
const signoutButton = document.getElementById('signout-button');
const signinError = document.getElementById('signin-error');
const signupError = document.getElementById('signup-error');
const container = document.getElementsByClassName('container')[0];


// Switch to sign-up form
createAccountButton.addEventListener('click', () => {
    signinForm.style.display = 'none';
    signupForm.style.display = 'block';
    signupError.textContent = '';
    signinError.textContent = '';
});

// Switch to sign-in form
backToSigninButton.addEventListener('click', () => {
    signupForm.style.display = 'none';
    signinForm.style.display = 'block';
});

// Sign up
signupButton.addEventListener('click', () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const dob = document.getElementById('signup-dob').value;
    const gender = document.getElementById('signup-gender').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // User created
            console.log('User Created:', userCredential.user);

            // Store additional user details in Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                dob: dob,
                gender: gender
            });
        })
        .then(() => {
            // Redirect to sign-in form
            signupForm.style.display = 'none';
            signinForm.style.display = 'block';
            signupError.textContent = 'Loading, wait....'; // Clear any previous error
        })
        .catch(error => {
            console.error('Sign Up Error:', error.message);
            signupError.textContent = `Error: please Create Your Account`;
        });
});

// Sign in
signinButton.addEventListener('click', () => {
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Signed in
            console.log('Signed In:', userCredential.user);
            signinError.textContent = 'Loading, wait....'; // Clear any previous error

            // Fetch user details from Firestore
            return db.collection('users').doc(userCredential.user.uid).get();
        })
        .then(doc => {
            if (doc.exists) {
                // Show dashboard
                signincontainer.style.display = 'none';
                signinForm.style.display = 'none';
                container.style.display = 'block';
            }
        })
        .catch(error => {
            signinError.textContent = `Error: ${error.message}`;
        });
});

// Sign out
signoutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        // Sign-out successful.
        document.getElementById('signin-email').value = '';
        document.getElementById('signin-password').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('signup-dob').value = '';
        document.getElementById('signup-gender').value = '';
        signinError.textContent = '';
        signupError.textContent = '';
        console.log('Signed Out');
        signincontainer.style.display = 'block';
        signinForm.style.display = 'block';
        container.style.display = 'none';

    }).catch((error) => {
        // An error happened.
        console.error('Sign Out Error:', error.message);
    });
});

// Dashboard
document.getElementById('addPostBtn').addEventListener('click', function() {
    const img = prompt('Enter image URL');
    const name = prompt('Enter name');
    const description = prompt('Enter description');

    if (img && name && description) {
        const postContainer = document.createElement('div');
        postContainer.className = 'post-container';
        
        const postItem = document.createElement('div');
        postItem.className = 'post-item';
        
        postItem.innerHTML = `
            <img src="${img}" alt="Post Image">
            <h2>${name}</h2>
            <p>${description}</p>
            <button onclick="deletePost(this)">Delete Post</button>
        `;
        
        postContainer.appendChild(postItem);
        document.getElementById('posts').appendChild(postContainer);
    } else {
        alert('All fields are required!');
    }
});

function deletePost(button) {
    const postContainer = button.parentNode.parentNode;
    postContainer.remove();
}   
