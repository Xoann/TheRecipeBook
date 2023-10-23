import { displayRecipes } from "./functions.js";
import { Database, Recipe, Ingredient } from "./classes.js";

let searchQuery = "";
let database;

firebase.auth().onAuthStateChanged((user) => {
  database = new Database(user.uid);
  if (database.user) {
    displayRecipes(database, "home");
  } else {
    console.log("uid not found");
  }
});

const signOutButton = document.getElementById("sign-out");
signOutButton.addEventListener("click", function () {
  if (user) {
    database.signOut();
  } else {
    window.location.href = "html/login.html";
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

////////////////////////
/// SEARCH BAR CODE ///
////////////////////////

const searchInput = document.getElementById("search-input");

function narrowSearch(search) {
  const matches = [];
  const names = database.recipes;

  for (const recipe of names) {
    if (recipe.toLowerCase().includes(search)) {
      matches.push(recipe);
    }
  }
  return matches;
}

function updateRecipes(recipeNames) {
  const recipeContainer = document.getElementById("recipe-container");
  recipeContainer.innerHTML = "";
  displayRecipes(recipeNames, database.user);
}

searchInput.addEventListener("input", function (event) {
  searchQuery = event.target.value.toLowerCase();

  const searchedRecipeNames = narrowSearch(searchQuery);
  updateRecipes(searchedRecipeNames);
});

//////////////////////////////
/// Generate Recipe Modals ///
//////////////////////////////

///////////////////////////
/// Shopping List Logic ///
///////////////////////////

const shoppingListButton = document.getElementById("shopping-list");
const shoppingListModal = document.getElementById("shopping-list-modal");

window.addEventListener("click", (event) => {
  if (event.target === shoppingListModal) {
    closeModal(shoppingListModal);
  }
});

// Values retreived from https://en.wikipedia.org/wiki/Cooking_weights_and_measures

// function decreaseRecipeCount(user) {
//   console.log("hi");
//   const docRef = firebase.firestore().collection("users").doc(user);
//   docRef.get().then((doc) => {
//     const recipeCount = doc.data().recipes;
//     docRef.update({
//       recipes: recipeCount - 1,
//     });
//   });
// }

// function deleteRecipe(recipe) {
//   decreaseRecipeCount(database.user);
//   const databaseRef = firebase
//     .database()
//     .ref(`${database.user}/recipes/${recipe}`);
//   databaseRef
//     .remove()
//     .then(function () {
//       console.log("Element removed successfully!");
//       delete recipes[recipe];
//       updateRecipes(narrowSearch(searchQuery));
//     })
//     .catch(function (error) {
//       console.error("Error removing element: " + error.message);
//     });

//   const storageRef = firebase.storage().ref();
//   storageRef
//     .child(`${database.user}/images/${recipe}`)
//     .delete()
//     .then(function () {
//       console.log("File deleted successfully.");
//     })
//     .catch(function (error) {
//       console.error("Error deleting file:", error);
//     });
// }

// For testing to auto add new recipes by pressing =
function writeUserData(
  recipeName,
  recipeDesc,
  cookTimeHrs,
  cookTimeMins,
  prepTimeHrs,
  prepTimeMins,
  servings,
  ingredients,
  steps,
  image
) {
  firebase
    .database()
    .ref(`${firebase.auth().currentUser.uid}/recipes/${recipeName}`)
    .set({
      recipeDesc: recipeDesc,
      cookTimeHrs: cookTimeHrs,
      cookTimeMins: cookTimeMins,
      prepTimeHrs: prepTimeHrs,
      prepTimeMins: prepTimeMins,
      servings: servings,
      ingredients: ingredients,
      steps: steps,
    });
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(
    `${firebase.auth().currentUser.uid}/images/${recipeName}`
  );

  if (image) {
    imageRef.put(image).then((snapshot) => {});
  } else {
    const imageUrl = "../../img/food-placeholder-1.jpg";
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a File object from the Blob
        const fileObject = new File([blob], "image.png", { type: "image/png" });
        imageRef.put(fileObject);
      });
  }
  console.log("Uploaded");
}

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

document.addEventListener("keydown", function (event) {
  if (event.key === "=" || event.code === "Add") {
    const randomName = generateRandomString(5);
    const image = "";
    writeUserData(
      randomName,
      "Cheesy garlic chicken bites cooked in one pan with broccoli and spinach in under 15 minutes. This quick tasty dish is a great keto option and can be served with zoodles or pasta!",
      "1",
      "15",
      "0",
      "5",
      "4",
      [
        { name: "chicken breasts", unit: "lbs", value: "2" },
        { name: "crushed pepper", unit: "tps.", value: "0.25" },
        { name: "salt and pepper", unit: "tps.", value: "1" },
        { name: "garlic", unit: "cloves", value: "3" },
        { name: "broccoli florets", unit: "cup", value: "2" },
        { name: "tomatoes", unit: "cup", value: "0.5" },
        { name: "baby spinach", unit: "cup", value: "2" },
        { name: "shredded cheese", unit: "cup", value: "0.5" },
        { name: "cream cheese", unit: "oz", value: "4" },
      ],
      [
        "Heat 2 tablespoons olive oil in a large saucepan over medium-high heat. Add the chopped chicken breasts, season with Italian seasoning, crushed red pepper, and salt & pepper",
        "Sautee for 4-5 minutes or until chicken is golden and cooked through.",
        "Add the garlic and saute for another minute or until fragrant. Add the tomato, broccoli, spinach, shredded cheese, and cream cheese.",
        "Cook for another 3-4 minutes or until the broccoli is cooked through.",
        "Serve with cooked pasta, rice, zucchini noodles or cauliflower rice.",
      ],
      image
    );
  }
  increaseRecipeCount(firebase.auth().currentUser.uid);
});

function increaseRecipeCount(user) {
  console.log("hi");
  const docRef = firebase.firestore().collection("users").doc(user);
  docRef.get().then((doc) => {
    const recipeCount = doc.data().recipes;
    console.log(recipeCount);
    docRef.update({
      recipes: recipeCount + 1,
    });
  });
}

// function adjustFontSize() {
//   let box = document.getElementsByClassName("top-elements");
//   let text = document.getElementsByClassName("recipe-name");

//   // Calculate the desired font size based on the box width

//   for (let i = 0; i < document.getElementsByClassName("modal").length; i++) {
//     console.log(box[0]);
//     var fontSize = box[0].offsetWidth / 10;

//     // Set the font size
//     text[i].style.fontSize = fontSize + "px";
//   }
// }

// Call the adjustFontSize function on page load and window resize
//window.addEventListener("DOMContentLoaded", adjustFontSize());
//window.addEventListener("resize", adjustFontSize());
