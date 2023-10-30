function sendPasswordResetEmail() {
  const email = document.getElementById("email").value;
  console.log("hi");

  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      document.getElementById("message").innerHTML =
        "Password reset email sent successfully!";
    })
    .catch((error) => {
      document.getElementById("message").innerHTML = `Error: ${error.message}`;
    });
}

const resetBtn = document.getElementById("reset-password-btn");

resetBtn.addEventListener("click", () => sendPasswordResetEmail());

const backBtn = document.getElementById("back-icon");

backBtn.addEventListener("click", () => (window.location.href = "login.html"));
