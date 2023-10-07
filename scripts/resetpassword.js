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

function handleInputError(errorElement, errorInput, errorLabel) {
  // errorInput.value = "";
  errorElement.classList.remove("hide");
  errorInput.classList.add("error-input");
  errorLabel.classList.add("error-label");

  errorInput.addEventListener("focus", function () {
    // removeErrorEffect(errorElement, errorInput, errorLabel);
  });
}

function removeErrorEffect(errorElement, errorInput, errorLabel) {
  errorElement.classList.add("hide");
  errorInput.classList.remove("error-input");
  errorLabel.classList.remove("error-label");
}

const resetPasswordBtn = document.getElementById("reset-password-btn");

resetPasswordBtn.addEventListener("click", () => {
  resetPassword();
});

// reset password

function resetPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get("oobCode");
  const newPassword = document.getElementById("sign-up-password-one").value;

  let isError = false;
  let isPasswordMissingError = false;
  let isConfirmMissingError = false;

  const passwordOne = document.getElementById("sign-up-password-one").value;
  const passwordTwo = document.getElementById("sign-up-password-two").value;

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

    const errorInput = document.getElementById("sign-up-password-two");
    const errorLabel = document.getElementById("sign-up-password-two-label");

    errorInput.classList.add("error-input");
    errorLabel.classList.add("error-label");
  } else if (passwordIsNotComplex(passwordOne) && !isPasswordMissingError) {
    isError = true;

    makeSuggestionError();
    const errorInput = document.getElementById("sign-up-password-one");
    const errorLabel = document.getElementById("sign-up-password-one-label");

    errorInput.classList.add("error-input");
    errorLabel.classList.add("error-label");
  }

  if (!isError) {
    console.log("no pwd errors");
    firebase
      .auth()
      .verifyPasswordResetCode(oobCode)
      .then((email) => {
        // Apply the new password
        return firebase.auth().confirmPasswordReset(oobCode, newPassword);
      })
      .then(() => {
        document.getElementById("message").innerHTML =
          "Password reset successfully!";
      })
      .catch((error) => {
        document.getElementById(
          "message"
        ).innerHTML = `Error: ${error.message}`;
      });
  }
}

function makeSuggestionError() {
  const suggestions = document.getElementsByClassName("suggestion");
  for (const suggestionElement of suggestions) {
    suggestionElement.classList.add("error-message");
  }
}
