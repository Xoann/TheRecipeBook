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
  const passwordTwo = document.getElementById("sign-up-password-two").value;
  const username = document.getElementById("sign-up-username").value;
  const firstName = document.getElementById("sign-up-first-name").value;
  const lastName = document.getElementById("sign-up-last-name").value;

  signUpUser(
    signUpEmail,
    passwordOne,
    passwordTwo,
    username,
    firstName,
    lastName
  );
});

signInAccountButton.addEventListener("click", function (event) {
  event.preventDefault();
  const signInEmail = document.getElementById("sign-in-email").value;
  const password = document.getElementById("sign-in-password").value;

  signInUser(signInEmail, password);
});

function signUpUser(
  email,
  passwordOne,
  passwordTwo,
  username,
  firstName,
  lastName
) {
  // Checking for empty inputs
  if (!email) {
    const errorElement = document.getElementById("errorMissingEmail");
    const errorInput = document.getElementById("sign-up-email");
    const errorLabel = document.getElementById("sign-up-email-label");
    handleInputError(errorElement, errorInput, errorLabel);
  }
  if (!firstName) {
    const errorElement = document.getElementById("errorMissingFirst");
    const errorInput = document.getElementById("sign-up-first-name");
    const errorLabel = document.getElementById("sign-up-first-name-label");
    handleInputError(errorElement, errorInput, errorLabel);
  }
  if (!lastName) {
    const errorElement = document.getElementById("errorMissingLast");
    const errorInput = document.getElementById("sign-up-last-name");
    const errorLabel = document.getElementById("sign-up-last-name-label");
    handleInputError(errorElement, errorInput, errorLabel);
  }
  if (!username) {
    const errorElement = document.getElementById("errorMissingUser");
    const errorInput = document.getElementById("sign-up-username");
    const errorLabel = document.getElementById("sign-up-username-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else if (isUsernameTaken(username)) {
    const errorElement = document.getElementById("errorUsernameTaken");
    const errorInput = document.getElementById("sign-up-username");
    const errorLabel = document.getElementById("sign-up-username-label");
    handleInputError(errorElement, errorInput, errorLabel);
  }
  if (!passwordOne) {
    const errorElement = document.getElementById("errorMissingPassword");
    const errorInput = document.getElementById("sign-up-password-one");
    const errorLabel = document.getElementById("sign-up-password-one-label");
    handleInputError(errorElement, errorInput, errorLabel);
  }

  if (!passwordTwo) {
    const errorElement = document.getElementById("errorMissingConfirm");
    const errorInput = document.getElementById("sign-up-password-two");
    const errorLabel = document.getElementById("sign-up-password-two-label");
    handleInputError(errorElement, errorInput, errorLabel);
  }

  if (passwordOne !== passwordTwo) {
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, passwordOne)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      firebase
        .firestore()
        .collection("fastData")
        .doc("usernames")
        .get()
        .then(function (doc) {
          let currUsernames = doc.data().usernames || [];
          currUsernames.push(username);

          firebase.firestore().collection("fastData").doc("usernames").update({
            usernames: currUsernames,
          });
        });

      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set({
          email: email,
          username: username,
          firstName: firstName,
          lastName: lastName,
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
  try {
    let userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    let user = userCredential.user;
    console.log(user);
    window.location.href = "../index.html";
  } catch (error) {
    // console.log(error.code);

    if (error.code === "auth/invalid-email") {
      const errorElement = document.getElementById("errorInvalidEmail");
      const errorInput = document.getElementById("sign-in-email");
      const errorLabel = document.getElementById("sign-in-email-label");
      handleInputError(errorElement, errorInput, errorLabel);
    } else if (error.code === "auth/wrong-password") {
      const errorElement = document.getElementById("errorUserPasswordWrong");
      const errorInput = document.getElementById("sign-in-password");
      const errorLabel = document.getElementById("sign-in-password-label");
      handleInputError(errorElement, errorInput, errorLabel);
    } else if (error.code === "auth/user-not-found") {
      const errorElement = document.getElementById("errorUserNotFound");
      const errorInput = document.getElementById("sign-in-email");
      const errorLabel = document.getElementById("sign-in-email-label");
      handleInputError(errorElement, errorInput, errorLabel);
    }
    handleInputError();
  }
}

function handleInputError(errorElement, errorInput, errorLabel) {
  errorInput.value = "";
  errorElement.classList.remove("hide");
  errorInput.classList.add("error-input");
  errorLabel.classList.add("error-label");

  errorInput.addEventListener("focus", function () {
    errorElement.classList.add("hide");
    errorInput.classList.remove("error-input");
    errorLabel.classList.remove("error-label");
  });
}

function isUsernameTaken(username) {
  firebase
    .firestore()
    .collection("fastData")
    .doc("usernames")
    .get()
    .then(function (doc) {
      let currUsernames = doc.data().usernames;
      return currUsernames.includes(username);
    });
}
