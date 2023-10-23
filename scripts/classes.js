function capitalize(word) {
  if (!word) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const volUnitsToMl = {
  "dr.": 0.0513429,
  "smdg.": 0.115522,
  "pn.": 0.231043,
  "ds.": 0.462086,
  "ssp.": 0.924173,
  "csp.": 1.84835,
  "fl.dr.": 3.69669,
  "tsp.": 4.92892,
  "dsp.": 9.85784,
  "tbsp.": 14.7868,
  "oz.": 29.5735,
  "wgf.": 59.1471,
  "tcf.": 118.294,
  C: 236.588,
  "pt.": 473.176,
  "qt.": 946.353,
  "gal.": 3785.41,
};

const massUnitsToG = {
  "oz.": 28.3495231,
  kg: 1000,
  lbs: 453.59,
};

function convertToMl(ingredient) {
  return ingredient.value * volUnitsToMl[ingredient.unit];
}

function convertMlToOther(mlValue, unit) {
  return (mlValue / volUnitsToMl[unit]).toFixed(2);
}

function convertToG(ingredient) {
  return ingredient.value * massUnitsToG[ingredient.unit];
}

function convertGToOther(gValue, unit) {
  return (gValue / massUnitsToG[unit]).toFixed(2);
}

export class UserlessDatabase {
  constructor() {
    this.usernamesRef = firebase
      .firestore()
      .collection("fastData")
      .doc("usernames");
    this.usernameToUidRef = firebase
      .firestore()
      .collection("fastData")
      .doc("usernameToUid");
  }

  isUsernameTaken(username) {
    return this.usernamesRef.get().then((doc) => {
      return doc.data().usernames.includes(username);
    });
  }
}

export class Database {
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
    this.recipeImageRef = (imageName) =>
      firebase.storage().ref(`${user}/images/${imageName}`);
    this.recipeImagesRef = firebase.storage().ref(user);
    this.recipeRef = firebase.database().ref(`${user}/recipes`);
    this.singleRecipeRef = (recipe) =>
      firebase.database().ref(`${user}/recipes/${recipe}`);

    this.user = user;
    this.userAuth = () => firebase.auth().currentUser;
  }
  // Auth
  signUpUser(email, username, firstName, lastName) {
    const promises = [];
    console.log(firebase.auth().currentUser.uid);
    promises.push(
      this.usernamesRef.get().then((doc) => {
        const currUsernames = doc.data().usernames || [];
        currUsernames.push(username);
        this.usernamesRef.update({ usernames: currUsernames });
      })
    );
    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    promises.push(
      this.userRef.set({
        email: email,
        username: username,
        firstName: firstName,
        lastName: lastName,
        friendsList: "[]",
        recipes: 0,
        forks: 0,
        dateJoined: formattedDate,
        shoppingListRecipes: [],
      })
    );
    promises.push(
      this.usernameToUidRef.get().then((doc) => {
        const existingMap = doc.data().usernameToUid;
        existingMap[username] = this.user;
        this.usernameToUidRef.update({
          usernameToUid: existingMap,
        });
      })
    );

    promises.push(
      fetch("../../img/default-pfp.png")
        .then((response) => response.blob())
        .then((blob) => {
          const fileObject = new File([blob], "image.png", {
            type: "image/png",
          });
          promises.push(this.profilePictureRef.put(fileObject));
        })
    );
    return Promise.all(promises);
  }

  deleteUser() {
    const promises = [];
    promises.push(this.recipeRef.remove());
    promises.push(this.userRef.delete());
    promises.push(
      this.usernamesRef.get().then((doc) => {
        this.getUsername().then((username) => {
          const updatedUsernames = doc
            .data()
            .usernames.filter((item) => item !== username);
          this.usernamesRef.update({
            usernames: updatedUsernames,
          });
        });
      })
    );
    promises.push(
      this.recipeImagesRef.listAll.then((files) => {
        files.items.forEach((item) => {
          item.delete();
        });
      })
    );
    promises.push(this.profilePictureRef.delete());
    promises.push(
      this.usernameToUidRef.get().then((doc) => {
        const map = doc.data().usernameToUid;
        this.getUsername().then((username) => {
          delete map.username;
        });
      })
    );
    promises.push(this.userAuth().delete());
    return Promise.all(promises);
  }

  isUsernameTaken(username) {
    return this.usernamesRef.get().then((doc) => {
      return doc.data().usernames.includes(username);
    });
  }

  // Getters
  getRecipe(name) {
    return this.recipeRef.once("value").then((snapshot) => {
      const recipeObj = snapshot.val()[name];
      const ingredients = [];
      for (const ingredient of recipeObj["ingredients"]) {
        ingredients.push(
          new Ingredient(
            ingredient["name"],
            ingredient["value"],
            ingredient["unit"]
          )
        );
      }
      return new Recipe(
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

  getAllRecipeNames() {
    return this.recipeRef.once("value").then((snapshot) => {
      return Object.keys(snapshot.val());
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
    return this.recipeImageRef(imageName)
      .getDownloadURL()
      .then((url) => {
        return url;
      });
  }

  getShoppingList() {
    return this.userRef.get().then((doc) => {
      return doc.data().shoppingListRecipes;
    });
  }

  // Setters

  setShoppingList(shoppingList) {
    return this.userRef.update({
      shoppingListRecipes: JSON.stringify(shoppingList),
    });
  }

  updatePfp(file) {
    const renamedFile = new File([file], "profile-picture.png", {
      type: file.type,
    });
    this.profilePictureRef.put(renamedFile);
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

  decreaseRecipeCount() {
    return this.userRef.get().then((doc) => {
      return this.userRef.update({
        recipes: doc.data().recipes - 1,
      });
    });
  }

  increaseRecipeCount() {
    return this.userRef.get().then((doc) => {
      return this.userRef.update({
        recipes: doc.data().recipes + 1,
      });
    });
  }

  deleteRecipe(recipe) {
    this.decreaseRecipeCount();
    const promises = [];
    promises.push(this.singleRecipeRef(recipe).remove());
    promises.push(this.recipeImageRef(recipe).delete());
    return Promise.all(promises);
  }

  addRecipe(recipe, image) {
    this.increaseRecipeCount();
    const promises = [];
    promises.push(
      this.singleRecipeRef(recipe.name).set({
        recipeDesc: recipe.recipeDesc,
        cookTimeHrs: recipe.cookTimeHrs,
        cookTimeMins: recipe.cookTimeMins,
        prepTimeHrs: recipe.prepTimeHrs,
        prepTimeMins: recipe.prepTimeMins,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
      })
    );

    if (image) {
      promises.push(this.recipeImageRef(recipe.name).put(image));
    } else {
      promises.push(
        fetch("../../img/food-placeholder-1.jpg")
          .then((response) => response.blob())
          .then((blob) => {
            this.recipeImageRef(recipe.name).put(
              new File([blob], "image.png", { type: "image/png" })
            );
          })
      );
    }
    console.log("uploaded");
  }

  recipeInShoppingList(recipe) {
    return this.userRef.get().then((doc) => {
      return doc.data().shoppingListRecipes.includes(recipe);
    });
  }

  updateShoppingList(recipe) {
    this.getShoppingList().then((shoppingList) => {
      if (!shoppingList.includes(recipe)) {
        shoppingList.push(recipe);
      } else {
        const idxToRemove = shoppingList.indexOf(recipe);
        if (idxToRemove !== -1) {
          shoppingList.splice(idxToRemove, 1);
        }
      }

      this.userRef.update({
        shoppingListRecipes: shoppingList,
      });
    });
  }

  getShoppingListIngredients() {
    let shoppingIngredientObject = {};
    let prefferedIngredientUnit = {};

    return this.getShoppingList().then((shoppingList) => {
      const promises = [];
      for (const recipeName of shoppingList) {
        promises.push(
          this.getRecipe(recipeName).then((recipe) => {
            const ingredients = recipe.ingredients;
            for (const ingredient of ingredients) {
              // console.log(shoppingIngredientObject);
              if (volUnitsToMl.hasOwnProperty(ingredient.unit)) {
                if (
                  !shoppingIngredientObject.hasOwnProperty([
                    ingredient.name,
                    "vol",
                  ])
                ) {
                  shoppingIngredientObject[[ingredient.name, "vol"]] =
                    convertToMl(ingredient);
                } else {
                  shoppingIngredientObject[[ingredient.name, "vol"]] +=
                    convertToMl(ingredient);
                }
              } else if (massUnitsToG.hasOwnProperty(ingredient.unit)) {
                if (
                  !shoppingIngredientObject.hasOwnProperty([
                    ingredient.name,
                    "mass",
                  ])
                ) {
                  shoppingIngredientObject[[ingredient.name, "mass"]] =
                    convertToG(ingredient);
                } else {
                  shoppingIngredientObject[[ingredient.name, "mass"]] +=
                    convertToG(ingredient);
                }
              } else {
                if (
                  !shoppingIngredientObject.hasOwnProperty([
                    ingredient.name,
                    ingredient.unit,
                  ])
                ) {
                  shoppingIngredientObject[[ingredient.name, ingredient.unit]] =
                    Number(ingredient.value);
                } else {
                  shoppingIngredientObject[
                    [ingredient.name, ingredient.unit]
                  ] += Number(ingredient.value);
                }
              }

              if (!prefferedIngredientUnit.hasOwnProperty(ingredient.unit)) {
                prefferedIngredientUnit[ingredient.name] = ingredient.unit;
              }
            }
          })
        );
      }

      return Promise.all(promises).then(() => {
        const returnIngredients = [];
        for (let ingAndUnitType of Object.keys(shoppingIngredientObject)) {
          const temp = ingAndUnitType.split(",");
          const ing = temp[0];
          const unitType = temp[1];
          let value = shoppingIngredientObject[ingAndUnitType];
          if (unitType === "vol") {
            value = convertMlToOther(value, prefferedIngredientUnit[ing]);
          } else if (unitType === "mass") {
            value = convertGToOther(value, prefferedIngredientUnit[ing]);
          }
          returnIngredients.push(
            new Ingredient(ing, Number(value), prefferedIngredientUnit[ing])
          );
        }
        return returnIngredients;
      });
    });
  }
}

export class Ingredient {
  constructor(name, value, unit) {
    this.name = name;
    this.value = value;
    this.unit = unit;
  }
}

export class Recipe {
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
