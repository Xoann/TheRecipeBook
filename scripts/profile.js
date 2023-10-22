import {
  unfriend,
  getPfp,
  getName,
  getUsername,
  addFriend,
  getDateJoined,
  getForkCount,
  getRecipeCount,
} from "./functions.js";

let currentUid;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUid = firebase.auth().currentUser.uid;
  }
  const urlParams = new URLSearchParams(window.location.search);
  const profile = urlParams.get("user");

  loadProfilePage(profile, currentUid);
});

function loadProfilePage(profile, loggedUser) {
  getPfp(profile).then((url) => {
    document.getElementById("pfp").src = url;
  });

  getUsername(profile).then((username) => {
    document.getElementById("profile-username").textContent = username;
  });

  getName(profile).then((name) => {
    document.getElementById("name").textContent = name;
  });

  getRecipeCount(profile).then((count) => {
    document.getElementById("recipe-count").textContent = count;
  });

  getForkCount(profile).then((count) => {
    document.getElementById("fork-count").textContent = count;
  });

  getDateJoined(profile).then((date) => {
    document.getElementById("date-joined").textContent = date;
  });
}
