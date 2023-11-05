// import {
//   unfriend,
//   getPfp,
//   getFriends,
//   getName,
//   addFriend,
//   updatePfp,
//   getUsername,
//   getDateJoined,
//   getForkCount,
//   getRecipeCount,
// } from "./functions.js";
import { Database } from "./classes.js";
import { compressImage } from "./functions.js";

let currentUid;
let database;

firebase.auth().onAuthStateChanged((user) => {
  database = new Database(firebase.auth().currentUser.uid);
  loadProfilePage(database);
});

function loadProfilePage(database) {
  database.getUsername().then((username) => {
    document.getElementById("user").textContent = username;
  });

  database.getName().then((name) => {
    document.getElementById("name").textContent = name;
  });

  database.getPfp().then((pfp) => {
    document.getElementById("pfp").src = pfp;
  });

  database.getDateJoined().then((date) => {
    document.getElementById("date-joined").textContent = date;
  });
  // database.getForkCount().then((forks) => {
  //   document.getElementById("fork-count").textContent = forks;
  // });
  database.getRecipeCount().then((recipes) => {
    console.log("hi");
    console.log(recipes);
    document.getElementById("recipe-count").textContent = recipes;
  });

  database.getFriends().then((friends) => {
    for (const friend of friends) {
      createNewFriendElement(friend);
    }
  });
}

function handleViewportChange(mq) {
  if (mq.matches) {
    // Media query matches (viewport is 600px or less)
    document.body.style.backgroundColor = "lightblue";
  } else {
    // Media query doesn't match
    document.body.style.backgroundColor = "white";
  }
}

// Initial check
const initialMatch = window.matchMedia("(max-width: 600px)");
handleViewportChange(initialMatch);

// Add a listener for viewport changes
initialMatch.addListener(handleViewportChange);

let friendMenuIsOpen = false;
const friendMenu = document.querySelector(".friend-menu");
function handleOpenFriendMenu(event, user, friend) {
  document
    .getElementById("friend-profile-btn")
    .addEventListener("click", () => {
      const params = { user: friend };
      const queryString = new URLSearchParams(params).toString();
      window.location.href = `profile.html?${queryString}`;
    });
  const btnRect = event.target.getBoundingClientRect();
  const top = btnRect.top + window.scrollY;
  const left = btnRect.left + window.scrollX;
  friendMenu.style.left = `${left + 15}px`;
  friendMenu.style.top = `${top + 35}px`;
  friendMenu.style.display = "flex";

  const unfriendBtn = document.getElementById("remove-friend-btn");
  unfriendBtn.addEventListener("click", () => {
    database.unfriend(friend);
    document.getElementById(`friend_${friend}`).style.display = "none";
  });
  friendMenuIsOpen = !friendMenuIsOpen;
}
document.body.addEventListener("click", (event) => {
  const OpenMenuBtns = document.getElementsByClassName("friend-menu-btn-open");
  const OpenMenuBtnsLst = Array.from(OpenMenuBtns);
  const targetNotMenuOpenBtn = OpenMenuBtnsLst.every(function (btn) {
    return event.target !== btn;
  });

  if (event.target !== friendMenu || targetNotMenuOpenBtn) {
    friendMenu.style.display = "none";
  }
});

// Friend searching
const searchInput = document.getElementById("searchFriends");
const scrollableDiv = document.getElementById("scrollable-friends-div");

// Add event listener for the input field
searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase();
  const friends = scrollableDiv.getElementsByClassName("friend");
  // Loop through elements and hide/show based on search value
  for (let friendElement of friends) {
    const friend = friendElement.children[0].children[1];
    const text = friend.textContent.toLowerCase();
    if (text.includes(searchValue)) {
      friendElement.style.display = "flex";
    } else {
      friendElement.style.display = "none";
    }
  }
});

let addFriendOpen = false;
const addFriendDiv = document.getElementById("add-friend");
const addFriendBtn = document.getElementById("add-friend-btn");
const addFriendClose = document.getElementById("add-friend-close");
const addFriendInput = document.getElementById("add-friend-input");
addFriendBtn.addEventListener("click", () => {
  document.getElementById("friend-yourself-error").style.display = "none";
  document.getElementById("already-friend-error").style.display = "none";
  document.getElementById("no-such-user-error").style.display = "none";
  if (addFriendOpen) {
    const inputValue = addFriendInput.value;

    database
      .addFriend(inputValue)
      .then((friend) => {
        createNewFriendElement(friend);
      })
      .catch((error) => {
        if (error.message === "Can't friend yourself") {
          document.getElementById("friend-yourself-error").style.display =
            "block";
        } else if (error.message === "They're already your friend") {
          document.getElementById("already-friend-error").style.display =
            "block";
        } else if (error.message === "User doesn't exist") {
          document.getElementById("no-such-user-error").style.display = "block";
        }
      });
  } else {
    addFriendDiv.classList.add("add-friend-animation");
    addFriendClose.classList.remove("hide-close");
    addFriendInput.classList.add("add-friend-input-animation");
    addFriendOpen = !addFriendOpen;
  }
});

addFriendInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && addFriendOpen) {
    document.getElementById("friend-yourself-error").style.display = "none";
    document.getElementById("already-friend-error").style.display = "none";
    document.getElementById("no-such-user-error").style.display = "none";
    const inputValue = addFriendInput.value;
    database
      .addFriend(inputValue)
      .then((friend) => {
        createNewFriendElement(friend);
      })
      .catch((error) => {
        if (error.message === "Can't friend yourself") {
          document.getElementById("friend-yourself-error").style.display =
            "block";
        } else if (error.message === "They're already your friend") {
          document.getElementById("already-friend-error").style.display =
            "block";
        } else if (error.message === "User doesn't exist") {
          document.getElementById("no-such-user-error").style.display = "block";
        }
      });
  }
});

function createNewFriendElement(friend) {
  const friendsDiv = document.getElementById("scrollable-friends-div");
  const friendElement = document.createElement("div");
  friendElement.classList.add("friend");
  friendElement.id = `friend_${friend}`;

  friendElement.addEventListener("click", (event) => {
    const params = { user: friend };
    const queryString = new URLSearchParams(params).toString();
    window.location.href = `profile.html?${queryString}`;
  });

  const friendPfpElement = document.createElement("img");
  const friendUsernameElement = document.createElement("span");
  const friendMenuBtn = document.createElement("div");
  friendMenuBtn.classList.add("friend-menu-btn-open");
  friendMenuBtn.id = `friend-menu-btn-open-${friend}`;
  friendMenuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    handleOpenFriendMenu(event, user, friend);
  });

  const rightSide = document.createElement("div");
  rightSide.classList.add("friend-side");
  const leftSide = document.createElement("div");
  leftSide.classList.add("friend-side");

  fetch("../svgs/vertical-elipses.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      const svgElement = svgDOM.querySelector("svg");
      // svgElement.id = `shop-icon-${recipeNames[i]}`;
      friendMenuBtn.appendChild(svgElement);
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
    });
  friendsDiv.appendChild(friendElement);
  friendElement.appendChild(rightSide);
  friendElement.appendChild(leftSide);
  rightSide.appendChild(friendPfpElement);
  rightSide.appendChild(friendUsernameElement);
  leftSide.appendChild(friendMenuBtn);

  database.getFriendPfp(friend).then((friendPfp) => {
    friendPfpElement.classList.add("friend-pfp");
    friendPfpElement.src = friendPfp;
  });
  database.getFriendUsername(friend).then((friendUsername) => {
    friendUsernameElement.classList.add("friend-username");
    friendUsernameElement.textContent = friendUsername;
  });
}

addFriendClose.addEventListener("click", () => {
  if (addFriendOpen) {
    document.getElementById("friend-yourself-error").style.display = "none";
    document.getElementById("already-friend-error").style.display = "none";
    document.getElementById("no-such-user-error").style.display = "none";
    addFriendDiv.classList.remove("add-friend-animation");
    addFriendClose.classList.add("hide-close");
    addFriendInput.classList.remove("add-friend-input-animation");
  }
  addFriendOpen = !addFriendOpen;
});

const pfpInput = document.getElementById("pfp-upload");
pfpInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    compressImage(file, 512, 512).then((compressedImage) => {
      database.updatePfp(compressedImage).then(() => {
        database.getPfp().then((pfp) => {
          document.getElementById("pfp").src = pfp;
        });
      });
    });
  }
});

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
    usernameButtonOut.classList.add("user-menu-button-maintain-hover");
    userMenuOpen = true;
    userMenu.classList.add("user-menu-appear");
    for (const item of userMenuItems) {
      item.classList.add("user-menu-item-appear");
    }
    this.setTimeout(function () {
      for (const item of userMenuItems) {
        item.classList.add("user-menu-item-block");
      }
    }, 40);
  } else if (event.target !== userMenu && userMenuOpen) {
    usernameButtonOut.classList.remove("user-menu-button-maintain-hover");
    userMenuOpen = false;
    userMenu.classList.remove("user-menu-appear");
    for (const item of userMenuItems) {
      item.classList.remove("user-menu-item-appear");
    }
    this.setTimeout(function () {
      for (const item of userMenuItems) {
        item.classList.remove("user-menu-item-block");
      }
    }, 20);
  }
});
