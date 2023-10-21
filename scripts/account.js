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

  getFriends(user).then((friends) => {
    const friendsDiv = document.getElementById("scrollable-friends-div");
    for (const friend of friends) {
      const friendElement = document.createElement("div");
      friendElement.classList.add("friend");

      const friendPfpElement = document.createElement("img");
      const friendUsernameElement = document.createElement("span");

      friendsDiv.appendChild(friendElement);
      friendElement.appendChild(friendPfpElement);
      friendElement.appendChild(friendUsernameElement);

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
  console.log(friends);
  // Loop through elements and hide/show based on search value
  for (let friendElement of friends) {
    const childElements = friendElement.children;
    const friend = childElements[1];
    const text = friend.textContent.toLowerCase();
    console.log(text);
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

addFriendClose.addEventListener("click", () => {
  if (addFriendOpen) {
    addFriendDiv.classList.remove("add-friend-animation");
    addFriendClose.classList.add("hide-close");
    addFriendInput.classList.remove("add-friend-input-animation");
  }
  addFriendOpen = !addFriendOpen;
});
