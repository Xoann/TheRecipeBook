// // Initialize the FirebaseUI Widget using Firebase.
// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// var uiConfig = {
//   callbacks: {
//     signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//       // User successfully signed in.
//       // Return type determines whether we continue the redirect automatically
//       // or whether we leave that to developer to handle.
//       return true;
//     },
//     uiShown: function () {
//       // The widget is rendered.
//       // Hide the loader.
//       // document.getElementById("loader").style.display = "none";
//     },
//   },
//   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//   signInFlow: "popup",
//   signInSuccessUrl: "../index.html",
//   signInOptions: [
//     // Leave the lines as is for the providers you want to offer your users.
//     firebase.auth.EmailAuthProvider.PROVIDER_ID,
//   ],
//   // Terms of service url.
//   tosUrl: "<your-tos-url>",
//   // Privacy policy url.
//   privacyPolicyUrl: "<your-privacy-policy-url>",
// };

// // The start method will wait until the DOM is loaded.
// ui.start("#firebaseui-auth-container", uiConfig);

// // const signOutButton = document.getElementById("signOut");

// // signOutButton.addEventListener("click", () => {
// //   firebase.auth().signOut();
// //   console.log("signed out");
// // });

// Sign in/up interactivity
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", function () {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () =>
  container.classList.remove("right-panel-active")
);

const signUpAccountButton = document.getElementById("signUpAccount");
const signInAccountButton = document.getElementById("signInAccount");

signUpAccountButton.addEventListener("click", function () {
  const signUpEmail = document.getElementById("sign-up-email").value;
  const passwordOne = document.getElementById("sign-up-password-one").value;
  const passwordTwo = document.getElementById("sign-up-password-Two").value;
  const username = document.getElementById("sign-up-username").value;
  const name = document.getElementById("sign-up-name").value;

  signUpUser(signUpEmail, password, username, name);
});

signInAccountButton.addEventListener("click", function (event) {
  event.preventDefault();
  const signInEmail = document.getElementById("sign-in-email").value;
  const password = document.getElementById("sign-in-password").value;

  signInUser(signInEmail, password);
});

function signUpUser(email, password, username, name) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      // Update additional user information (username, name, etc.) in Firestore or Realtime Database
      // For example, if you are using Firestore:
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set({
          email: email,
          username: username,
          name: name,
        })
        .then(() => {
          // User data saved successfully
          console.log("User signed up successfully!");
        })
        .catch((error) => {
          // Handle errors while saving additional user information
          console.error("Error saving user data: ", error);
        });
    })
    .catch((error) => {
      // Handle errors during user registration
      console.error("Error signing up: ", error);
    });
}

async function signInUser(email, password) {
  console.log("signin1");
  try {
    let userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    let user = userCredential.user;
    console.log(user);
    // Redirect or do other tasks after successful sign-in
    window.location.href = "../index.html";
  } catch (error) {
    // Handle errors
    console.error(error.code, error.message);
  }
}
