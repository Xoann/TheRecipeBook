import { displayRecipes, closeModal } from "./functions.js";
import { Database, Recipe, Ingredient } from "./classes.js";

import { addIngredient } from "./addingredientbutton.js";
import { addStep } from "./addstepbutton.js";
import { handleFileChange } from "./addimage.js";
import { displayImage } from "./addimage.js";
import { deleteImage } from "./addimage.js";
import { checkErrors } from "./submitrecipe.js";

var currentUid;
let recipes;

let searchQuery = "";
let database;
let recipeNames;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    database = new Database(user.uid);
    database.getRecipeNames().then((names) => {
      recipeNames = names;
      displayRecipes(database, "home");
    });
  } else {
    console.log("uid not found");
    window.location.href = "./login.html";
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

async function getImageURLs(image_names, uid) {
  const storageRef = firebase.storage().ref();
  const imageURLs = {};

  for (let i = 0; i < image_names.length; i++) {
    const imageName = image_names[i];

    const imageRef = storageRef.child(uid).child("images").child(imageName);

    await imageRef.getDownloadURL().then((url) => {
      imageURLs[imageName] = url;
    });
  }
  return imageURLs;
}

////////////////////////
/// SEARCH BAR CODE ///
////////////////////////

const searchInput = document.getElementById("search-input");

function narrowSearch(search) {
  const matches = [];
  for (const name of Object.keys(recipeNames)) {
    if (name.toLowerCase().includes(search)) {
      matches.push(name);
    }
  }
  return matches;
}

function updateRecipes(searchedRecipeNames) {
  for (const name of Object.keys(recipeNames)) {
    if (searchedRecipeNames.includes(name)) {
      document.getElementById(`${recipeNames[name]}-recipe-div`).style.display =
        "inline-block";
    } else {
      document.getElementById(`${recipeNames[name]}-recipe-div`).style.display =
        "none";
    }
  }
}

searchInput.addEventListener("input", function (event) {
  searchQuery = event.target.value.toLowerCase();

  const searchedRecipeNames = narrowSearch(searchQuery);
  updateRecipes(searchedRecipeNames);
});

//////////////////////////////
/// Generate Recipe Modals ///
//////////////////////////////

//////////////////////////
////Edit Recipe Modals////
/////////////////////////

function restrictInput(event, element, maxLength) {
  var allowedCharacters = /^[0-9\/]*$/; // Regex for numbers and /
  var inputField = event.target;
  //var errorMessage = document.getElementById("error-message");

  // Check if the entered character is allowed
  if (!allowedCharacters.test(inputField.value)) {
    // Prevent the character from being entered
    inputField.value = inputField.value.slice(0, -1);

    //errorMessage.textContent = "Please enter only numbers and /.";
  }
  limitInputLength(element, maxLength);
}

window.addEventListener("click", function (event) {
  let datalistList = document.getElementsByClassName("data-list");
  let unitInputList = document.getElementsByClassName("unit-input");

  for (let i = 0; i < datalistList.length; i++) {
    if (
      datalistList[i].style.display === "block" &&
      event.target !== datalistList[i] &&
      event.target !== unitInputList[i]
    ) {
      datalistList[i].style.display = "none";
    }
  }
});

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

//close slideout menu whenever something else is clicked
window.addEventListener("click", function (e) {
  let menuButtonSvgList = document.getElementsByClassName("ellipsis-x");
  let menuButtonDotList = document.getElementsByClassName("dot");
  let menuButtonAddTextList = document.getElementsByClassName("add-button");
  let menuButtonAddSvgList = document.getElementsByClassName("add-svg");
  //console.log(e.target);
  let closeMenus = 1;
  for (let svg of menuButtonSvgList) {
    if (e.target === svg) {
      closeMenus = 0;
    }
  }
  for (let dot of menuButtonDotList) {
    if (e.target === dot) {
      closeMenus = 0;
    }
  }
  for (let addText of menuButtonAddTextList) {
    if (e.target === addText) {
      closeMenus = 0;
    }
  }
  for (let addSvg of menuButtonAddSvgList) {
    if (e.target === addSvg) {
      closeMenus = 0;
    }
  }

  if (closeMenus === 1) {
    for (let menu of document.getElementsByClassName("slideout-menu")) {
      menu.classList.remove("sliding-menu-transition");
    }
  }
});

document
  .getElementById("close-delete-modal")
  .addEventListener("click", function () {
    closeModal(document.getElementById("delete-modal"));
  });

function deleteAcount(uid) {
  // Delete all recipes under this uid
  const realtimeDatabase = firebase.database();
  const recipesRef = realtimeDatabase.ref(uid);
  recipesRef
    .remove()
    .then(function () {
      console.log("Element removed successfully!");
    })
    .catch(function (error) {
      console.error("Error removing element: " + error.message);
    });

  // Delete from users in Firestore
  const firestore = firebase.firestore();
  const userDocRef = firestore.collection("users").doc(uid);
  userDocRef
    .delete()
    .then(function () {
      console.log("Document successfully deleted!");
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });

  // Delete username from fast data
  const fastDataDoc = firestore.collection("fastData").doc("usernames");
  fastDataDoc
    .get()
    .then(function (doc) {
      if (doc.exists) {
        const dataArray = doc.data().yourArrayFieldName;
        // Remove the specific element from the array
        const updatedArray = dataArray.filter((item) => item !== uid);

        // Update the document with the modified array
        fastDataDoc
          .update({
            yourArrayFieldName: updatedArray,
          })
          .then(function () {
            console.log("Element removed from the array successfully!");
          })
          .catch(function (error) {
            console.error("Error removing element from the array: ", error);
          });
      } else {
        console.log("Document not found!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });

  // Delete img dir in storage
  const storage = firebase.storage();
  const storageRef = storage.ref();
  storageRef
    .child(uid)
    .listAll.then(function (result) {
      result.items.forEach(function (item) {
        // Delete each file in the folder
        item
          .delete()
          .then(function () {
            console.log("File deleted successfully.");
          })
          .catch(function (error) {
            console.error("Error deleting file:", error);
          });
      });
    })
    .catch(function (error) {
      console.error("Error listing files in the folder:", error);
    });

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
          const fileObject = new File([blob], "image.png", {
            type: "image/png",
          });
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
}

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
