import { capitalize } from "./functions";

class Database {
  constructor(user) {
    this.usernamesRef = firebase
      .firestore()
      .collection("fastData")
      .doc("usernames");
    this.usernameToUidRef = firebase
      .firestore()
      .collection("fastData")
      .doc("usernameToUid");
    this.userRef = firebase.firestore().collection("users").doc(user);
    this.profilePictureRef = firebase
      .storage()
      .ref(`${user}/pfp/profile-picture`);
    this.recipeImagesRef = (imageName) =>
      firebase.storage().ref(`${user}/images/${imageName}`);
    this.recipeRef = firebase.database().ref(`${user}/recipes`);
    this.user = user;
  }
  // Auth
  signUpUser() {}

  logInUser() {}

  deleteUser() {}

  // Getters
  getRecipe(name) {
    return this.recipeRef.once("value").then((snapshot) => {
      const recipeObj = snapshot.val()[name];
      const ingredients = [];
      for (const ingredient of recipeObj["ingredients"]) {
        ingredients.push(
          Ingredient(
            ingredient["name"],
            ingredient["value"],
            ingredient["unit"]
          )
        );
      }
      return Recipe(
        recipeObj["name"],
        recipeObj["recipeDesc"],
        recipeObj["cookTimeHrs"],
        recipeObj["cookTimeMins"],
        recipeObj["prepTimeHrs"],
        recipeObj["prepTimeMins"],
        recipeObj["servings"],
        ingredients,
        recipeObj["steps"]
      );
    });
  }

  getUid(username) {
    return this.usernameToUidRef.get().then((doc) => {
      const usernameMap = doc.data().usernameToUid;
      if (usernameMap.hasOwnProperty(username)) {
        return usernameMap[username];
      }
      throw new Error("User does not exist");
    });
  }

  getUsername() {
    return this.userRef.get().then((doc) => {
      return doc.data().username;
    });
  }

  getName() {
    return this.userRef.get().then((doc) => {
      return `${capitalize(doc.data().firstName)} ${capitalize(
        doc.data().lastName
      )}`;
    });
  }

  getFriends() {
    return this.userRef.get().then((doc) => {
      return JSON.parse(doc.data().friendsList);
    });
  }

  getPfp() {
    return this.profilePictureRef.getDownloadURL().then((url) => {
      return url;
    });
  }

  getDateJoined() {
    return this.userRef.get().then((doc) => {
      return doc.data().dateJoined;
    });
  }

  getForkCount() {
    return this.userRef.get().then((doc) => {
      return doc.data().forks;
    });
  }

  getRecipeCount() {
    return this.userRef.get().then((doc) => {
      return doc.data().recipes;
    });
  }

  getRecipeImage(imageName) {
    return this.recipeImagesRef(imageName)
      .getDownloadURL()
      .then((url) => {
        return url;
      });
  }

  // Other
  unfriend(friend) {
    getFriends(this.user).then((friends) => {
      friends = friends.filter((item) => item !== friend);
      this.userRef
        .update({
          friendsList: JSON.stringify(friends),
        })
        .then(() => {
          console.log("friend removed");
        });
    });
  }

  addFriend(friendUsername) {
    try {
      uidLookup(friendUsername).then((uid) => {
        getFriends(this.user).then((friends) => {
          friends.push(uid);
          this.userRef
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

  updatePfp(file) {
    const renamedFile = new File([file], "profile-picture.png", {
      type: file.type,
    });
    this.profilePictureRef.put(renamedFile);
  }
}

class Ingredient {
  constructor(name, value, unit) {
    this.name = name;
    this.value = value;
    this.unit = unit;
  }
}

class Recipe {
  constructor(
    name,
    desc,
    cookTimeHrs,
    cookTimeMins,
    prepTimeHrs,
    prepTimeMins,
    servings,
    ingredients,
    steps
  ) {
    this.name = name;
    this.desc = desc;
    this.cookTimeHrs = cookTimeHrs;
    this.cookTimeMins = cookTimeMins;
    this.prepTimeHrs = prepTimeHrs;
    this.prepTimeMins = prepTimeMins;
    this.servings = servings;
    this.ingredients = ingredients;
    this.steps = steps;
  }
}
