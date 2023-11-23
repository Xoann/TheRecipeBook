import { Database } from "./classes.js";

const userMenu = document.getElementsByClassName("user-menu")[0];
const usernameButtonOut = document.getElementById("username-button");
const usernameButtonIn = document.getElementById("username");
const userMenuItems = document.getElementsByClassName("user-menu-list-item");
const pfp = document.getElementById("pfp-nav");
let userMenuOpen = false;

window.addEventListener("click", function (event) {
  if (
    (event.target === usernameButtonOut ||
      event.target === usernameButtonIn ||
      event.target === pfp) &&
    !userMenuOpen
  ) {
    userMenuOpen = true;
    userMenu.classList.add("user-menu-appear");
    usernameButtonIn.classList.add("user-menu-button-maintain-hover");
    userMenu.style.borderWidth = "1px";
  } else if (event.target !== userMenu && userMenuOpen) {
    userMenuOpen = false;
    userMenu.classList.remove("user-menu-appear");
    usernameButtonIn.classList.remove("user-menu-button-maintain-hover");
    this.setTimeout(() => {
      userMenu.style.borderWidth = "0px";
    }, 100);
  }
});

document.getElementById("profile-page").addEventListener("click", () => {
  window.location.href = "account.html";
});

document.getElementById("nav-profile").addEventListener("click", () => {
  window.location.href = "account.html";
});

document.getElementById("sign-out-page").addEventListener("click", () => {
  window.location.href = "login.html";
});

document.getElementById("nav-sign-out").addEventListener("click", () => {
  window.location.href = "login.html";
});

document.getElementById("h").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("shopping-list").addEventListener("click", () => {
  window.location.href = "shoppinglist.html";
});

document.getElementById("add-recipe").addEventListener("click", () => {
  window.location.href = "addrecipe.html";
});

firebase.auth().onAuthStateChanged((user) => {
  const database = new Database(firebase.auth().currentUser.uid);
  const usernameText = document.getElementById("username-button");
  const navPfp = document.getElementById("pfp-nav");

  database.getUsername().then((username) => {
    if (!window.localStorage.getItem("username")) {
      document.querySelector("#username").style.width = "fit-content";

      usernameText.textContent = username;
    }
    document.querySelector("#username").style.width = "fit-content";

    window.localStorage.setItem("username", username);
  });

  database.getPfp().then((url) => {
    if (!window.localStorage.getItem("pfp")) {
      navPfp.src = url;
    }

    window.localStorage.setItem("pfp", url);
  });

  if (window.localStorage.getItem("username")) {
    usernameText.textContent = localStorage.getItem("username");
  }

  if (window.localStorage.getItem("pfp")) {
    navPfp.src = localStorage.getItem("pfp");
  }
});

const navToggleButton = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");

// navToggleButton.addEventListener("click", () => {
//   const visible = navList.getAttribute("mobile-visible");
//   if (visible === "true") {
//     navList.setAttribute("mobile-visible", "false");
//     navToggleButton.setAttribute("mobile-visible", "false");
//     navToggleButton.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />`;
//   } else {
//     navList.setAttribute("mobile-visible", "true");
//     navToggleButton.setAttribute("mobile-visible", "true");
//     navToggleButton.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />`;
//   }
// });

window.addEventListener("click", (event) => {
  const visible = navList.getAttribute("mobile-visible");
  if (event.target === document.querySelector("#nav-dark-mode")) {
    return;
  }

  if (
    event.target === navToggleButton ||
    event.target === document.querySelector(".nav-path")
  ) {
    if (visible === "true") {
      navList.setAttribute("mobile-visible", "false");
      navToggleButton.setAttribute("mobile-visible", "false");
      navToggleButton.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />`;
    } else {
      navList.setAttribute("mobile-visible", "true");
      navToggleButton.setAttribute("mobile-visible", "true");
      navToggleButton.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" class="nav-path"/>`;
    }
  } else if (event.target !== navList) {
    if (visible === "true") {
      navList.setAttribute("mobile-visible", "false");
      navToggleButton.setAttribute("mobile-visible", "false");
      navToggleButton.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" class="nav-path"/>`;
    }
  }
});
