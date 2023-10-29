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
    }, 200);
  }
});
document.getElementById("profile-page").addEventListener("click", () => {
  window.location.href = "account.html";
});

document.getElementById("sign-out-page").addEventListener("click", () => {
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

  database.getUsername().then((username) => {
    window.localStorage.setItem("username", username);
  });

  database.getPfp().then((url) => {
    window.localStorage.setItem("pfp", url);
  });

  document.getElementById("username-button").textContent =
    localStorage.getItem("username");

  document.getElementById("pfp-nav").src = localStorage.getItem("pfp");
});
