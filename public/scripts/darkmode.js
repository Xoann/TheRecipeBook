let darkMode = localStorage.getItem("darkMode");
if (darkMode === "enabled") {
  enableDarkMode();
} else {
  disableDarkMode();
}

document.querySelector("#darkmode").addEventListener("click", function () {
  darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});

document.querySelector("#nav-dark-mode").addEventListener("click", function () {
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
  document.getElementById("sun").style.display = "block";
  document.getElementById("moon").style.display = "none";
  document.getElementById("toggle-dark-mode").textContent = "Light Mode";
  document.getElementById("nav-dark-mode").textContent = "Light Mode";

  document.querySelector(".nav-list").classList.remove("light-nav-list");
}

function disableDarkMode() {
  localStorage.setItem("darkMode", "disabled");
  document.body.classList.add("lightMode");
  document.getElementById("toggle-dark-mode").textContent = "Dark Mode";
  document.getElementById("nav-dark-mode").textContent = "Dark Mode";
  document.getElementById("sun").style.display = "none";
  document.getElementById("moon").style.display = "block";

  document.querySelector(".nav-list").classList.add("light-nav-list");
}
