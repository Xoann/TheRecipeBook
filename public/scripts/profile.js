import { displayRecipes } from "./functions.js";
import { Database } from "./classes.js";

let currentUid;
let database;

firebase.auth().onAuthStateChanged((user) => {
  database = new Database(firebase.auth().currentUser.uid);
  if (user) {
    currentUid = firebase.auth().currentUser.uid;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const profile = urlParams.get("user");

  loadProfilePage(profile, currentUid);
});

function loadProfilePage(profile, loggedUser) {
  database.getFriendPfp(profile).then((url) => {
    document.getElementById("pfp").src = url;
  });

  database.getFriendUsername(profile).then((username) => {
    document.getElementById("profile-username").textContent = username;
  });

  database.getFriendName(profile).then((name) => {
    document.getElementById("name").textContent = name;
  });

  database.getFriendRecipeCount(profile).then((count) => {
    document.getElementById("recipe-count").textContent = count;
  });

  database.getFriendForkCount(profile).then((count) => {
    document.getElementById("fork-count").textContent = count;
  });

  database.getFriendDateJoined(profile).then((date) => {
    document.getElementById("date-joined").textContent = date;
  });

  displayRecipes(database, "profile", profile);
}