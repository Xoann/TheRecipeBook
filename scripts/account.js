let currentUid;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUid = firebase.auth().currentUser.uid;
  }

  loadProfilePage(currentUid);
});

function loadProfilePage(user) {
  getUsername(user).then((username) => {
    document.getElementById("user").textContent = username;
  });

  getName(user).then((name) => {
    document.getElementById("name").textContent = name;
  });

  getPfp(user).then((pfp) => {
    document.getElementById("pfp").src = pfp;
  });

  getDateJoined(user).then((date) => {
    document.getElementById("date-joined").textContent = date;
  });
  getForkCount(user).then((forks) => {
    document.getElementById("fork-count").textContent = forks;
  });
  getRecipeCount(user).then((recipes) => {
    document.getElementById("recipe-count").textContent = recipes;
  });

  getFriends(user).then((friends) => {
    const friendsDiv = document.getElementById("scrollable-friends-div");
    for (const friend of friends) {
      const friendElement = document.createElement("div");
      friendElement.classList.add("friend");
      friendElement.id = `friend_${friend}`;

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

      getPfp(friend).then((friendPfp) => {
        friendPfpElement.classList.add("friend-pfp");
        friendPfpElement.src = friendPfp;
      });
      getUsername(friend).then((friendUsername) => {
        friendUsernameElement.classList.add("friend-username");
        friendUsernameElement.textContent = friendUsername;
      });
    }
  });
}

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
  friendMenu.style.left = `${left + 50}px`;
  friendMenu.style.top = `${top}px`;
  friendMenu.style.display = "flex";

  const unfriendBtn = document.getElementById("remove-friend-btn");
  unfriendBtn.addEventListener("click", () => {
    unfriend(user, friend);
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

function unfriend(user, friend) {
  console.log(`${user} no longer likes ${friend}`);
  getFriends(user).then((friends) => {
    friends = friends.filter((item) => item !== friend);

    const docRef = firebase.firestore().collection("users").doc(user);
    docRef
      .update({
        friendsList: JSON.stringify(friends),
      })
      .then(() => {
        console.log("friend removed");
      });
  });
}

function getPfp(user) {
  const imageRef = firebase
    .storage()
    .ref()
    .child(user)
    .child("pfp")
    .child("profile-picture");
  return imageRef.getDownloadURL().then((url) => {
    return url;
  });
}

function getFriends(user) {
  const docRef = firebase.firestore().collection("users").doc(user);
  return docRef.get().then((doc) => {
    const stringData = doc.data().friendsList;
    return JSON.parse(stringData);
  });
}

function getName(user) {
  const docRef = firebase.firestore().collection("users").doc(user);
  return docRef.get().then((doc) => {
    const firstName = doc.data().firstName;
    const lastName = doc.data().lastName;
    return `${capitalize(firstName)} ${capitalize(lastName)}`;
  });
}

function capitalize(word) {
  if (!word) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getUsername(user) {
  const docRef = firebase.firestore().collection("users").doc(user);
  return docRef.get().then((doc) => {
    return doc.data().username;
  });
}

function uidLookup(username) {
  const docRef = firebase
    .firestore()
    .collection("fastData")
    .doc("usernameToUid");
  return docRef.get().then((doc) => {
    const usernameMap = doc.data().usernameToUid;
    // console.log(typeof usernameMap);
    if (usernameMap.hasOwnProperty(username)) {
      return usernameMap[username];
    }
    throw new Error("User does not exist");
  });
}

function addFriend(user, friendUsername) {
  try {
    uidLookup(friendUsername).then((uid) => {
      getFriends(user).then((friends) => {
        friends.push(uid);

        const docRef = firebase.firestore().collection("users").doc(user);
        docRef
          .update({
            friendsList: JSON.stringify(friends),
          })
          .then(() => {
            console.log("friend added");
          });
      });
    });
  } catch (error) {
    console.log(error);
  }
}

// Friend searching
const searchInput = document.getElementById("searchFriends");
const scrollableDiv = document.getElementById("scrollable-friends-div");

// Add event listener for the input field
searchInput.addEventListener("input", function () {
  const searchValue = searchInput.value.toLowerCase();
  const friends = scrollableDiv.getElementsByClassName("friend");
  // Loop through elements and hide/show based on search value
  for (let friendElement of friends) {
    const childElements = friendElement.children;
    const friend = childElements[1];
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
  if (addFriendOpen) {
    const inputValue = addFriendInput.value;
    addFriend(currentUid, inputValue);
  } else {
    addFriendDiv.classList.add("add-friend-animation");
    addFriendClose.classList.remove("hide-close");
    addFriendInput.classList.add("add-friend-input-animation");
  }
  addFriendOpen = !addFriendOpen;
});

addFriendInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const inputValue = addFriendInput.value;
    addFriend(currentUid, inputValue);
  }
});

addFriendClose.addEventListener("click", () => {
  if (addFriendOpen) {
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
    updatePfp(currentUid, file);
  }
});

function updatePfp(user, file) {
  const pfpRef = firebase.storage().ref().child(`${user}/pfp/profile-picture`);
  const renamedFile = new File([file], "profile-picture.png", {
    type: file.type,
  });
  pfpRef.put(renamedFile).then(() => {
    getPfp(user).then((pfp) => {
      document.getElementById("pfp").src = pfp;
    });
  });
}

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

function getDateJoined(user) {
  const docRef = firebase.firestore().collection("users").doc(user);
  return docRef.get().then((doc) => {
    return doc.data().dateJoined;
  });
}

function getForkCount(user) {
  const docRef = firebase.firestore().collection("users").doc(user);
  return docRef.get().then((doc) => {
    return doc.data().forks;
  });
}

function getRecipeCount(user) {
  const docRef = firebase.firestore().collection("users").doc(user);
  return docRef.get().then((doc) => {
    return doc.data().recipes;
  });
}
