const firebaseConfig = {
  apiKey: "AIzaSyBdZGDDPJC-PYljU0HDnnZi64Z6do0w7K0",
  authDomain: "recipebook2-a9e9a.firebaseapp.com",
  databaseURL: "https://recipebook2-a9e9a-default-rtdb.firebaseio.com",
  projectId: "recipebook2-a9e9a",
  storageBucket: "recipebook2-a9e9a.appspot.com",
  messagingSenderId: "384328070783",
  appId: "1:384328070783:web:dbdb4004f591e84682314a",
};
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    var uid = user.uid;
    console.log(firebase.auth().currentUser.uid);
    console.log("signed in");
  } else {
    console.log("signed out");
    // User is signed out
    // ...
  }
});

window.addEventListener("load", (event) => {
  console.log("initialized");
});

firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });