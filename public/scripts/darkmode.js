let darkMode = localStorage.getItem("darkMode");
if (darkMode === "enabled") {
  enableDarkMode();
} else {
  disableDarkMode();
}

document
  .querySelector("#toggle-dark-mode")
  .addEventListener("click", function () {
    darkMode = localStorage.getItem("darkMode");
    if (darkMode === "enabled") {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });

function enableDarkMode() {
  localStorage.setItem("darkMode", "enabled");
  document.body.classList.remove("lightMode");
}

function disableDarkMode() {
  localStorage.setItem("darkMode", "disabled");
  document.body.classList.add("lightMode");
}
