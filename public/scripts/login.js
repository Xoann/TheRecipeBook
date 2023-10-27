import { Database, UserlessDatabase } from "./classes.js";

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().signOut();
});

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

signUpAccountButton.addEventListener("click", function (event) {
  event.preventDefault();
  const signUpEmail = document.getElementById("sign-up-email").value;
  const passwordOne = document.getElementById("sign-up-password-one").value;
  const passwordTwo = document.getElementById("sign-up-password-two").value;
  const username = document.getElementById("sign-up-username").value;
  const firstName = document.getElementById("sign-up-first-name").value;
  const lastName = document.getElementById("sign-up-last-name").value;

  const voidDatabase = new UserlessDatabase();
  signUpUser(
    voidDatabase,
    signUpEmail,
    passwordOne,
    passwordTwo,
    username,
    firstName,
    lastName
  ).then(() => {
    window.location.href = "../index.html";
  });
});

signInAccountButton.addEventListener("click", function (event) {
  event.preventDefault();
  const signInEmail = document.getElementById("sign-in-email").value;
  const password = document.getElementById("sign-in-password").value;

  signInUser(signInEmail, password);
});

async function signUpUser(
  database,
  email,
  passwordOne,
  passwordTwo,
  username,
  firstName,
  lastName
) {
  let isError = false;
  // Checking for empty inputs
  if (!email) {
    isError = true;
    const otherErrorElement = document.getElementById("errorInvalidEmail");
    otherErrorElement.classList.add("hide");
    const errorElement = document.getElementById("errorMissingEmail");
    const errorInput = document.getElementById("sign-up-email");
    const errorLabel = document.getElementById("sign-up-email-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else if (!isValidEmail(email)) {
    isError = true;
    const otherErrorElement = document.getElementById("errorMissingEmail");
    otherErrorElement.classList.add("hide");
    const errorElement = document.getElementById("errorInvalidEmail");
    const errorInput = document.getElementById("sign-up-email");
    const errorLabel = document.getElementById("sign-up-email-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else {
    const errorElement = document.getElementById("errorMissingEmail");
    const errorInput = document.getElementById("sign-up-email");
    const errorLabel = document.getElementById("sign-up-email-label");
    removeErrorEffect(errorElement, errorInput, errorLabel);
  }
  if (!firstName) {
    isError = true;
    const errorElement = document.getElementById("errorMissingFirst");
    const errorInput = document.getElementById("sign-up-first-name");
    const errorLabel = document.getElementById("sign-up-first-name-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else {
    const errorElement = document.getElementById("errorMissingFirst");
    const errorInput = document.getElementById("sign-up-first-name");
    const errorLabel = document.getElementById("sign-up-first-name-label");
    removeErrorEffect(errorElement, errorInput, errorLabel);
  }
  if (!lastName) {
    isError = true;
    const errorElement = document.getElementById("errorMissingLast");
    const errorInput = document.getElementById("sign-up-last-name");
    const errorLabel = document.getElementById("sign-up-last-name-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else {
    const errorElement = document.getElementById("errorMissingLast");
    const errorInput = document.getElementById("sign-up-last-name");
    const errorLabel = document.getElementById("sign-up-last-name-label");
    removeErrorEffect(errorElement, errorInput, errorLabel);
  }
  if (!username) {
    isError = true;

    const otherErrorElement = document.getElementById("errorUsernameTaken");
    otherErrorElement.classList.add("hide");

    const errorElement = document.getElementById("errorMissingUser");
    const errorInput = document.getElementById("sign-up-username");
    const errorLabel = document.getElementById("sign-up-username-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else if (await database.isUsernameTaken(username)) {
    isError = true;

    const otherErrorElement = document.getElementById("errorMissingUser");
    otherErrorElement.classList.add("hide");

    const errorElement = document.getElementById("errorUsernameTaken");
    const errorInput = document.getElementById("sign-up-username");
    const errorLabel = document.getElementById("sign-up-username-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else {
    const otherErrorElement = document.getElementById("errorMissingUser");
    otherErrorElement.classList.add("hide");
    const errorElement = document.getElementById("errorUsernameTaken");
    const errorInput = document.getElementById("sign-up-username");
    const errorLabel = document.getElementById("sign-up-username-label");
    removeErrorEffect(errorElement, errorInput, errorLabel);
  }

  let isPasswordMissingError = false;
  let isConfirmMissingError = false;

  if (!passwordOne) {
    isError = true;
    isPasswordMissingError = true;

    makeSuggestionError();

    const errorElement = document.getElementById("errorMissingPassword");
    const errorInput = document.getElementById("sign-up-password-one");
    const errorLabel = document.getElementById("sign-up-password-one-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else {
    const errorElement = document.getElementById("errorMissingPassword");
    const errorInput = document.getElementById("sign-up-password-one");
    const errorLabel = document.getElementById("sign-up-password-one-label");
    removeErrorEffect(errorElement, errorInput, errorLabel);
  }

  if (!passwordTwo) {
    isError = true;
    isConfirmMissingError = true;
    const errorElement = document.getElementById("errorMissingConfirm");
    const errorInput = document.getElementById("sign-up-password-two");
    const errorLabel = document.getElementById("sign-up-password-two-label");
    handleInputError(errorElement, errorInput, errorLabel);
  } else {
    const errorElement = document.getElementById("errorMissingConfirm");
    const errorInput = document.getElementById("sign-up-password-two");
    const errorLabel = document.getElementById("sign-up-password-two-label");
    removeErrorEffect(errorElement, errorInput, errorLabel);
  }

  if (passwordOne !== passwordTwo && !isConfirmMissingError) {
    isError = true;
    const errorElement = document.getElementById("errorPasswordDontMatch");
    errorElement.classList.add("error-message");
    document
      .getElementById("signIn")
      .addEventListener("click", () =>
        errorElement.classList.remove("error-message")
      );

    const errorInput = document.getElementById("sign-up-password-two");
    const errorLabel = document.getElementById("sign-up-password-two-label");

    errorInput.classList.add("error-input");
    errorLabel.classList.add("error-label");
    document.getElementById("signIn").addEventListener("click", () => {
      errorInput.classList.remove("error-input");
      errorLabel.classList.remove("error-label");
    });
  } else if (passwordIsNotComplex(passwordOne) && !isPasswordMissingError) {
    isError = true;

    makeSuggestionError();
    const errorInput = document.getElementById("sign-up-password-one");
    const errorLabel = document.getElementById("sign-up-password-one-label");

    errorInput.classList.add("error-input");
    errorLabel.classList.add("error-label");

    document.getElementById("signIn").addEventListener("click", () => {
      errorInput.classList.remove("error-input");
      errorLabel.classList.remove("error-label");
    });
  }

  if (!isError) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, passwordOne)
      .then((userCredential) => {
        const userDatabase = new Database(userCredential.user.uid);

        return userDatabase.signUpUser(email, username, firstName, lastName);
      });
  }
}

function makeSuggestionError() {
  const suggestions = document.getElementsByClassName("suggestion");
  for (const suggestionElement of suggestions) {
    suggestionElement.classList.add("error-message");
    if (!suggestionElement.classList.contains("hide")) {
      document
        .getElementById("signIn")
        .addEventListener("click", () =>
          suggestionElement.classList.remove("error-message")
        );
    }
  }
}

function signInUser(email, password) {
  try {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "../index.html";
      });
  } catch (error) {
    if (error.code === "auth/invalid-email") {
      const errorElement = document.getElementById("errorInvalidEmail");
      const errorInput = document.getElementById("sign-in-email");
      const errorLabel = document.getElementById("sign-in-email-label");
      handleInputError(errorElement, errorInput, errorLabel);
    } else if (error.code === "auth/wrong-password") {
      const errorElement = document.getElementById("errorUserPasswordWrong");
      const errorInput = document.getElementById("sign-in-password");
      const errorLabel = document.getElementById("sign-in-password-label");
      errorInput.value = "";
      handleInputError(errorElement, errorInput, errorLabel);
    } else if (error.code === "auth/user-not-found") {
      const errorElement = document.getElementById("errorUserNotFound");
      const errorInput = document.getElementById("sign-in-email");
      const errorLabel = document.getElementById("sign-in-email-label");
      handleInputError(errorElement, errorInput, errorLabel);
    }
    // handleInputError();
  }
}

function handleInputError(errorElement, errorInput, errorLabel) {
  // errorInput.value = "";
  errorElement.classList.remove("hide");
  errorInput.classList.add("error-input");
  errorLabel.classList.add("error-label");

  errorInput.addEventListener("focus", function () {
    // removeErrorEffect(errorElement, errorInput, errorLabel);
  });

  document
    .getElementById("signIn")
    .addEventListener("click", () =>
      removeErrorEffect(errorElement, errorInput, errorLabel)
    );
  document
    .getElementById("signUp")
    .addEventListener("click", () =>
      removeErrorEffect(errorElement, errorInput, errorLabel)
    );
}

function removeErrorEffect(errorElement, errorInput, errorLabel) {
  errorElement.classList.add("hide");
  errorInput.classList.remove("error-input");
  errorLabel.classList.remove("error-label");
}

function passwordIsNotComplex(password) {
  const specialCharacters = [
    "!",
    '"',
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "@",
    "[",
    "\\",
    "]",
    "^",
    "_",
    "`",
    "{",
    "|",
    "}",
    "~",
  ];
  const numberRegex = /\d/;
  const upperCaseRegex = /[A-Z]/;

  let isCharPresent = specialCharacters.some(function (char) {
    return password.includes(char);
  });

  if (password.length < 8) {
    return "errorPasswordTooShort";
  } else if (!upperCaseRegex.test(password)) {
    return "errorPasswordNoUppercase";
  } else if (!numberRegex.test(password)) {
    return "errorNoNumber";
  } else if (!isCharPresent) {
    return "errorNoSpecialCharacter";
  } else {
    return "";
  }
}

let currSuggestion = "";

const signUpPasswordOne = document.getElementById("sign-up-password-one");
signUpPasswordOne.addEventListener("input", function () {
  const password = signUpPasswordOne.value;
  const passwordComplexity = passwordIsNotComplex(password);
  const errorPasswordTooShortSpan = document.getElementById(
    "errorPasswordTooShort"
  );
  const errorPasswordNoUppercaseSpan = document.getElementById(
    "errorPasswordNoUppercase"
  );
  const errorPasswordNoNumberSpan = document.getElementById("errorNoNumber");
  const errorNoSpecialCharacterSpan = document.getElementById(
    "errorNoSpecialCharacter"
  );

  const otherErrorElement = document.getElementById("errorMissingPassword");
  otherErrorElement.classList.add("hide");

  if (!password) {
    errorPasswordTooShortSpan.classList.add("hide");
    errorPasswordNoUppercaseSpan.classList.add("hide");
    errorPasswordNoNumberSpan.classList.add("hide");
    errorNoSpecialCharacterSpan.classList.add("hide");
  } else if (
    passwordComplexity === "errorPasswordTooShort" &&
    currSuggestion !== "errorPasswordTooShort"
  ) {
    errorPasswordTooShortSpan.classList.remove("hide");
    errorPasswordNoUppercaseSpan.classList.add("hide");
    errorPasswordNoNumberSpan.classList.add("hide");
    errorNoSpecialCharacterSpan.classList.add("hide");
  } else if (
    passwordComplexity === "errorPasswordNoUppercase" &&
    currSuggestion !== "errorPasswordTooShort"
  ) {
    errorPasswordTooShortSpan.classList.add("hide");
    errorPasswordNoUppercaseSpan.classList.remove("hide");
    errorPasswordNoNumberSpan.classList.add("hide");
    errorNoSpecialCharacterSpan.classList.add("hide");
  } else if (
    passwordComplexity === "errorNoNumber" &&
    currSuggestion !== "errorPasswordTooShort"
  ) {
    errorPasswordTooShortSpan.classList.add("hide");
    errorPasswordNoUppercaseSpan.classList.add("hide");
    errorPasswordNoNumberSpan.classList.remove("hide");
    errorNoSpecialCharacterSpan.classList.add("hide");
  } else if (
    passwordComplexity === "errorNoSpecialCharacter" &&
    currSuggestion !== "errorPasswordTooShort"
  ) {
    errorPasswordTooShortSpan.classList.add("hide");
    errorPasswordNoUppercaseSpan.classList.add("hide");
    errorPasswordNoNumberSpan.classList.add("hide");
    errorNoSpecialCharacterSpan.classList.remove("hide");
  } else {
    errorPasswordTooShortSpan.classList.add("hide");
    errorPasswordNoUppercaseSpan.classList.add("hide");
    errorPasswordNoNumberSpan.classList.add("hide");
    errorNoSpecialCharacterSpan.classList.add("hide");
  }
});

const signUpPasswordTwo = document.getElementById("sign-up-password-two");

signUpPasswordTwo.addEventListener("input", function () {
  const password = signUpPasswordOne.value;
  const confirm = signUpPasswordTwo.value;
  const errorElement = document.getElementById("errorPasswordDontMatch");

  if (!confirm || passwordsMatch(password, confirm)) {
    errorElement.classList.add("hide");
  } else {
    errorElement.classList.remove("hide");
  }
});

function passwordsMatch(password, confirm) {
  return password === confirm;
}

function isValidEmail(email) {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
