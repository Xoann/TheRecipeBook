function capitalize(word) {
  if (!word) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const volUnitsToMl = {
  ml: 1,
  mL: 1,
  mls: 1,
  mLs: 1,
  ML: 1,
  MLs: 1,
  "mL.": 1,
  "ml.": 1,

  "L.": 1000,
  L: 1000,
  l: 1000,
  liter: 1000,
  Liter: 1000,
  liters: 1000,
  Liters: 1000,

  "dr.": 0.0513429,
  "smdg.": 0.115522,
  "pn.": 0.231043,
  "ds.": 0.462086,
  "ssp.": 0.924173,
  "csp.": 1.84835,
  "fl.dr.": 3.69669,

  "tsp.": 4.92892,
  tsp: 4.92892,
  Tsp: 4.92892,

  "dsp.": 9.85784,

  "tbsp.": 14.7868,
  tbsp: 14.7868,
  "Tbsp.": 14.7868,
  TbSp: 14.7868,

  "oz.": 29.5735,
  oz: 29.5735,
  ounce: 29.5735,
  Oz: 29.5735,
  Ounce: 29.5735,
  ounces: 29.5735,
  Ounces: 29.5735,

  "wgf.": 59.1471,
  "tcf.": 118.294,
  C: 236.588,

  "pt.": 473.176,
  pt: 473.176,
  pint: 473.176,
  Pint: 473.176,
  Pt: 473.176,
  pints: 473.176,
  Pints: 473.176,

  "qt.": 946.353,
  "Qt.": 946.353,
  qt: 946.353,
  quart: 946.353,
  Quart: 946.353,
  quarts: 946.353,
  Quarts: 946.353,

  "gal.": 3785.41,
  gal: 3785.41,
  gallon: 3785.41,
  gallons: 3785.41,
  Gallon: 3785.41,
  Gallons: 3785.41,
};

const massUnitsToG = {
  mg: 0.001,
  "mg.": 0.001,
  mgs: 0.001,

  "g.": 1,
  g: 1,
  gram: 1,
  Gram: 1,
  grams: 1,
  Grams: 1,

  kg: 1000,
  "kg.": 1000,
  Kg: 1000,
  kilogram: 1000,
  Kilogram: 1000,
  KG: 1000,
  Kgs: 1000,

  "oz.": 28.3495231,
  oz: 28.3495231,
  ounce: 28.3495231,
  ounces: 28.3495231,
  Ounce: 28.3495231,
  Ounces: 28.3495231,

  lbs: 453.59,
  pound: 453.59,
  pounds: 453.59,
  Pound: 453.59,
  Pounds: 453.59,
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
    this.friendRef = (friend) =>
      firebase.firestore().collection("users").doc(friend);
    this.userRef = firebase.firestore().collection("users").doc(user);
    this.profilePictureRef = firebase
      .storage()
      .ref(`${user}/pfp/profile-picture`);
    this.recipeImageRef = (imageId, user) =>
      firebase.storage().ref(`${user}/images/${imageId}`);
    this.recipeImagesRef = firebase.storage().ref(user);
    this.recipeRef = (user) => firebase.database().ref(`${user}/recipes`);
    this.singleRecipeRef = (recipeId, user) =>
      firebase.database().ref(`${user}/recipes/${recipeId}`);
    this.friendProfilePictureRef = (friend) =>
      firebase.storage().ref(`${friend}/pfp/profile-picture`);
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
        recipeCount: 0,
        forks: 0,
        dateJoined: formattedDate,
        shoppingListRecipes: [],
        recipes: {},
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
  getRecipe(id, user = this.user) {
    return this.singleRecipeRef(id, user)
      .once("value")
      .then((snapshot) => {
        const recipe = snapshot.val();
        const ingredients = [];
        for (const ingredient of recipe["ingredients"]) {
          ingredients.push(
            new Ingredient(
              ingredient["name"],
              ingredient["value"],
              ingredient["unit"]
            )
          );
        }
        return new Recipe(
          recipe["recipeName"],
          recipe["recipeDesc"],
          recipe["cookTimeHrs"],
          recipe["cookTimeMins"],
          recipe["prepTimeHrs"],
          recipe["prepTimeMins"],
          recipe["servings"],
          ingredients,
          recipe["steps"]
        );
      });
  }

  // Returns all recipe Ids
  getAllRecipeNames(user = this.user) {
    return this.recipeRef(user)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.val()) {
          // throw new Error("You have no recipes");
          console.log("no recipes");
          return null;
        }
        return Object.keys(snapshot.val());
      });
  }

  getRecipeNames() {
    return this.getAllRecipeNames().then((ids) => {
      if (!ids) {
        return null;
      }
      const promises = [];
      const names = {};
      for (const id of ids) {
        promises.push(
          this.getRecipe(id).then((recipe) => {
            names[recipe.name] = id;
          })
        );
      }
      return Promise.all(promises).then(() => {
        return names;
      });
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

  getFriendUsername(friend) {
    return this.friendRef(friend)
      .get()
      .then((doc) => {
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

  getFriendName(friend) {
    return this.friendRef(friend)
      .get()
      .then((doc) => {
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

  getFriendPfp(friend) {
    return this.friendProfilePictureRef(friend)
      .getDownloadURL()
      .then((url) => {
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
    return this.recipeRef(this.user)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.val()) {
          return 0;
        }
        return Object.keys(snapshot.val()).length;
      });
  }

  getFriendDateJoined(friend) {
    return this.friendRef(friend)
      .get()
      .then((doc) => {
        return doc.data().dateJoined;
      });
  }

  getFriendForkCount(friend) {
    return this.friendRef(friend)
      .get()
      .then((doc) => {
        return doc.data().forks;
      });
  }

  getFriendRecipeCount(friend) {
    return this.friendRef(friend)
      .get()
      .then((doc) => {
        return doc.data().recipeCount;
      });
  }

  getRecipeImage(imageId, user = this.user) {
    return this.recipeImageRef(imageId, user)
      .getDownloadURL()
      .then((url) => {
        return url;
      })
      .catch(() => {
        return null;
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
    console.log(file);
    const renamedFile = new File([file], "profile-picture.png", {
      type: file.type,
    });
    return this.profilePictureRef.put(renamedFile);
  }

  // Other
  unfriend(friend) {
    this.getFriends(this.user).then((friends) => {
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

  uidLookup(username) {
    return this.usernameToUidRef.get().then((doc) => {
      return doc.data().usernameToUid[username];
    });
  }

  addFriend(friendUsername) {
    return this.uidLookup(friendUsername)
      .then((uid) => {
        if (uid === this.user) {
          throw new Error("Can't friend yourself");
        }
        return this.getFriends(this.user).then((friends) => {
          if (friends.includes(uid)) {
            throw new Error("They're already your friend");
          }
          return this.isUsernameTaken(friendUsername).then((userExists) => {
            if (!userExists) {
              throw new Error("User doesn't exist");
            }
            friends.push(uid);
            return this.userRef
              .update({
                friendsList: JSON.stringify(friends),
              })
              .then(() => {
                console.log("friend added");
                return uid;
              });
          });
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  generateId() {
    const characters =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    const length = 16;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }

    return id;
  }

  getNewRecipeId() {
    return this.getAllRecipeNames().then((ids) => {
      let id;

      id = this.generateId();

      if (ids) {
        while (ids.includes(id)) {
          id = this.generateId();
        }
      }
      return id;
    });
  }

  deleteRecipe(recipeId) {
    const promises = [];

    promises.push(this.singleRecipeRef(recipeId, this.user).remove());
    promises.push(
      this.recipeImageRef(recipeId, this.user)
        .delete()
        .catch((error) => {
          console.log(error);
        })
    );

    return Promise.all(promises);
  }

  addRecipe(recipe, image = null) {
    const promises = [];

    promises.push(
      this.getNewRecipeId().then((id) => {
        promises.push(
          this.singleRecipeRef(id, this.user).set({
            recipeName: recipe.name,
            recipeDesc: recipe.desc,
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
          promises.push(this.recipeImageRef(id, this.user).put(image));
        } else {
          promises.push(
            fetch("../../img/food-placeholder-1.jpg")
              .then((response) => response.blob())
              .then((blob) => {
                promises.push(
                  this.recipeImageRef(recipe.name, this.user).put(
                    new File([blob], "image.png", { type: "image/png" })
                  )
                );
              })
          );
        }
      })
    );

    console.log("uploaded");
    return Promise.all(promises);
  }

  editRecipeData(recipeId, recipe) {
    return this.singleRecipeRef(recipeId, this.user).set({
      recipeName: recipe.name,
      recipeDesc: recipe.desc,
      cookTimeHrs: recipe.cookTimeHrs,
      cookTimeMins: recipe.cookTimeMins,
      prepTimeHrs: recipe.prepTimeHrs,
      prepTimeMins: recipe.prepTimeMins,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    });
  }

  editRecipeImage(recipeId, image) {
    return this.recipeImageRef(recipeId, this.user).put(image);
  }

  recipeInShoppingList(recipeId) {
    return this.userRef.get().then((doc) => {
      return doc.data().shoppingListRecipes.includes(recipeId);
    });
  }

  updateShoppingList(recipeId) {
    return this.getShoppingList().then((shoppingList) => {
      if (!shoppingList.includes(recipeId)) {
        shoppingList.push(recipeId);
      } else {
        const idxToRemove = shoppingList.indexOf(recipeId);
        if (idxToRemove !== -1) {
          shoppingList.splice(idxToRemove, 1);
        }
      }

      return this.userRef.update({
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
                if (
                  !prefferedIngredientUnit.hasOwnProperty([
                    ingredient.name,
                    "vol",
                  ])
                ) {
                  prefferedIngredientUnit[[ingredient.name, "vol"]] =
                    ingredient.unit;
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
                if (
                  !prefferedIngredientUnit.hasOwnProperty([
                    ingredient.name,
                    "mass",
                  ])
                ) {
                  prefferedIngredientUnit[[ingredient.name, "mass"]] =
                    ingredient.unit;
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
                if (
                  !prefferedIngredientUnit.hasOwnProperty([
                    ingredient.name,
                    ingredient.unit,
                  ])
                ) {
                  prefferedIngredientUnit[[ingredient.name, ingredient.unit]] =
                    ingredient.unit;
                }
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
            value = convertMlToOther(
              value,
              prefferedIngredientUnit[[ing, "vol"]]
            );
          } else if (unitType === "mass") {
            value = convertGToOther(
              value,
              prefferedIngredientUnit[[ing, "mass"]]
            );
          }
          returnIngredients.push(
            new Ingredient(
              ing,
              Number(value),
              prefferedIngredientUnit[[ing, unitType]]
            )
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
