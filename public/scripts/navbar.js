import { Database } from "./classes.js";

const userMenu = document.getElementsByClassName("user-menu")[0];
const usernameButtonOut = document.getElementById("username-button");
const usernameButtonIn = document.getElementById("username");
const userMenuItems = document.getElementsByClassName("user-menu-list-item");
let userMenuOpen = false;

window.addEventListener("click", function (event) {
  if (
    (event.target === usernameButtonOut || event.target === usernameButtonIn) &&
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
    document.getElementById("username-button").textContent = username;
  });

  database.getPfp().then((url) => {
    document.getElementById("pfp-nav").src = url;
  });
});
