import { displayRecipes, getImageURLs } from "./functions.js";
import { Database } from "./classes.js";

var currentUid;
let recipes;
let searchQuery = "";
let checkboxStatus = {};
let shoppingList = [];

firebase.auth().onAuthStateChanged((user) => {
  const signOutButton = document.getElementById("sign-out");
  signOutButton.addEventListener("click", function () {
    if (user) {
      firebase.auth().signOut();
    } else {
      window.location.href = "html/login.html";
    }
  });
  if (user) {
    currentUid = firebase.auth().currentUser.uid;
    console.log(firebase.auth().currentUser.uid);

    const dbr = firebase.database().ref(`${currentUid}/recipes/`);

    dbr.once("value").then((snapshot) => {
      recipes = snapshot.val();
      const imageNames = [];

      for (const key in recipes) {
        if (recipes.hasOwnProperty(key)) {
          imageNames.push(key);
        }
      }
      displayRecipes(imageNames, currentUid);
    });

    document.getElementById("sign-out").innerText = "Sign Out";
  } else {
    console.log("uid not found");
    document.getElementById("sign-out").innerText = "Sign In";
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
  const names = Object.keys(recipes);

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
  displayRecipes(recipeNames, currentUid);
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

async function checkRecipeInDbList(recipe, svgElement, shoppingText) {
  // returns true if recipe in shopping list in db
  const doc = await firebase
    .firestore()
    .collection("users")
    .doc(currentUid)
    .get();

  shoppingList = JSON.parse(doc.data().shoppingListRecipes);
  if (shoppingList.includes(recipe)) {
    svgElement.classList.add("shop-added");
    shoppingText.classList.add("shop-added");
  }
}

const shoppingListButton = document.getElementById("shopping-list");
const shoppingListModal = document.getElementById("shopping-list-modal");

window.addEventListener("click", (event) => {
  if (event.target === shoppingListModal) {
    closeModal(shoppingListModal);
  }
});

async function handleShoppingToggle(recipeName) {
  const docRef = firebase.firestore().collection("users").doc(currentUid);

  if (!shoppingList.includes(recipeName)) {
    shoppingList.push(recipeName);
  } else {
    const idxToRemove = shoppingList.indexOf(recipeName);
    if (idxToRemove !== -1) {
      shoppingList.splice(idxToRemove, 1);
    }
  }
  const shoppingIngredients = JSON.stringify(combineIngredients());
  const imageUrls = await getImageURLs(shoppingList, currentUid);
  const imageUrlsStr = JSON.stringify(imageUrls);

  docRef.update({
    shoppingListRecipes: JSON.stringify(shoppingList),
    shoppingIngredients: shoppingIngredients,
    shoppingListImages: imageUrlsStr,
  });

  document
    .getElementById(`shop-text-${recipeName}`)
    .classList.toggle("shop-added");
  document
    .getElementById(`shop-icon-${recipeName}`)
    .classList.toggle("shop-added");
  checkboxStatus[recipeName] = !checkboxStatus[recipeName];
  console.log(`shopping list: ${shoppingList}`);
}

// Values retreived from https://en.wikipedia.org/wiki/Cooking_weights_and_measures
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

function combineIngredients() {
  let shoppingIngredientObject = {};
  let prefferedIngredientUnit = {};
  // loop thru recipes
  for (const shoppingRecipeName of shoppingList) {
    const recipeIngredients = recipes[shoppingRecipeName]["ingredients"];
    // console.log(recipeIngredients);
    // loop thru ingredients
    for (let i = 0; i < recipeIngredients.length; i++) {
      const ingredient = recipeIngredients[i]["name"];
      const ingredientUnit = recipeIngredients[i]["unit"];

      // Add to shoppingIngredientObject
      // console.log(ingredient);
      // console.log(shoppingIngredientObject);

      if (volUnitsToMl.hasOwnProperty(ingredientUnit)) {
        if (!shoppingIngredientObject.hasOwnProperty([ingredient, "vol"])) {
          shoppingIngredientObject[[ingredient, "vol"]] = convertToMl(
            recipeIngredients[i]
          );
        } else {
          shoppingIngredientObject[[ingredient, "vol"]] += convertToMl(
            recipeIngredients[i]
          );
        }
      } else if (massUnitsToG.hasOwnProperty(ingredientUnit)) {
        if (!shoppingIngredientObject.hasOwnProperty([ingredient, "mass"])) {
          shoppingIngredientObject[[ingredient, "mass"]] = convertToG(
            recipeIngredients[i]
          );
        } else {
          shoppingIngredientObject[[ingredient, "mass"]] += convertToG(
            recipeIngredients[i]
          );
        }
      } else {
        if (
          !shoppingIngredientObject.hasOwnProperty([ingredient, ingredientUnit])
        ) {
          shoppingIngredientObject[[ingredient, ingredientUnit]] = Number(
            recipeIngredients[i]["value"]
          );
        } else {
          shoppingIngredientObject[[ingredient, ingredientUnit]] +=
            recipeIngredients[i];
        }
      }

      // Add to prefferedIngredientUnit
      if (!prefferedIngredientUnit.hasOwnProperty(ingredientUnit)) {
        prefferedIngredientUnit[ingredient] = ingredientUnit;
      }
    }
  }
  // Convert back into list of ingridients
  let returnIngredients = [];
  const ingAndUnitTypes = Object.keys(shoppingIngredientObject);
  for (let ingAndUnitType of ingAndUnitTypes) {
    const temp = ingAndUnitType.split(",");
    const ing = temp[0];
    const unitType = temp[1];
    let value = shoppingIngredientObject[ingAndUnitType];
    if (unitType === "vol") {
      value = convertMlToOther(value, prefferedIngredientUnit[ing]);
    } else if (unitType === "mass") {
      value = convertGToOther(value, prefferedIngredientUnit[ing]);
    }
    returnIngredients.push({
      ingredient: ing,
      value: Number(value),
      unit: prefferedIngredientUnit[ing],
    });
  }
  return returnIngredients;
}

function convertToMl(ingredient) {
  return ingredient["value"] * volUnitsToMl[ingredient["unit"]];
}

function convertMlToOther(mlValue, unit) {
  return (mlValue / volUnitsToMl[unit]).toFixed(2);
}

function convertToG(ingredient) {
  return ingredient["value"] * massUnitsToG[ingredient["unit"]];
}

function convertGToOther(gValue, unit) {
  return (gValue / massUnitsToG[unit]).toFixed(2);
}

function updateShoppingListModal() {
  const shoppingModalContent = document.getElementById(
    "shopping-list-modal-content"
  );
  shoppingModalContent.innerHTML = "";

  const ingredients = combineIngredients();

  for (const ingredient of ingredients) {
    const unit = ingredient["unit"];
    const ingredientValue = ingredient["value"];

    const ingredientNameElement = document.createElement("h3");
    ingredientNameElement.textContent = `${ingredient["ingredient"]} ${ingredientValue} ${unit}`;

    shoppingModalContent.appendChild(ingredientNameElement);
  }
}

function multiplyFractionByNumber(fractionString, numerator, denominator) {
  if (fractionString.length === 0) {
    return fractionString;
  }

  if (fractionString.indexOf("/") === -1) {
    fractionString = fractionString + "/1";
  }

  // Extract numerator and denominator from the fraction string
  const [fractionNumerator, fractionDenominator] = fractionString.split("/");

  // Convert the extracted parts to numbers
  const parsedNumerator = parseFloat(fractionNumerator);
  const parsedDenominator = parseFloat(fractionDenominator);

  // Check if parsing was successful
  if (isNaN(parsedNumerator) || isNaN(parsedDenominator)) {
    console.log("Invalid fraction format");
    return NaN;
  }

  // Multiply the fraction by the given numerator and denominator
  const resultNumerator = parsedNumerator * numerator;
  const resultDenominator = parsedDenominator * denominator;

  // Return the result as a simplified fraction
  return simplifyFraction(resultNumerator, resultDenominator);
}

// Function to simplify a fraction
function simplifyFraction(numerator, denominator) {
  const gcd = calculateGCD(numerator, denominator);
  const simplifiedNumerator = numerator / gcd;
  const simplifiedDenominator = denominator / gcd;
  if (simplifiedDenominator === 1) {
    return `${simplifiedNumerator}`;
  } else if (simplifiedNumerator > simplifiedDenominator) {
    let whole =
      (simplifiedNumerator - (simplifiedNumerator % simplifiedDenominator)) /
      simplifiedDenominator;
    let fractionNumerator = simplifiedNumerator % simplifiedDenominator;
    return `${whole} ${fractionNumerator}/${simplifiedDenominator}`;
  } else {
    return `${simplifiedNumerator}/${simplifiedDenominator}`;
  }
}

// Function to calculate the Greatest Common Divisor (GCD)
function calculateGCD(a, b) {
  return b === 0 ? a : calculateGCD(b, a % b);
}

function handleElipsisBtnPress(recipeName) {
  const clickedMenu = document.getElementById(`slideout-menu-${recipeName}`);
  clickedMenu.classList.toggle("sliding-menu-transition");

  const otherMenus = document.getElementsByClassName("slideout-menu");
  for (let menu of otherMenus) {
    if (menu !== clickedMenu) {
      menu.classList.remove("sliding-menu-transition");
    }
  }
}

function handleDeleteRecipe(recipeName) {
  // Modify delete modal
  const deleteModalText = document.getElementById("delete-modal-text");
  deleteModalText.textContent = `Are you sure you want to delete your ${recipeName} recipe?`;

  // Display delete modal
  const modal = document.getElementById("delete-modal");
  openModal(modal);

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });

  const deleteAcountBtn = document.getElementById("delete-recipe-final-btn");

  deleteAcountBtn.addEventListener("click", () => {
    deleteRecipe(recipeName);
    closeModal(modal);
  });
}

function decreaseRecipeCount(user) {
  console.log("hi");
  const docRef = firebase.firestore().collection("users").doc(user);
  docRef.get().then((doc) => {
    const recipeCount = doc.data().recipes;
    docRef.update({
      recipes: recipeCount - 1,
    });
  });
}

function deleteRecipe(recipe) {
  decreaseRecipeCount(currentUid);
  const databaseRef = firebase
    .database()
    .ref(`${currentUid}/recipes/${recipe}`);
  databaseRef
    .remove()
    .then(function () {
      console.log("Element removed successfully!");
      delete recipes[recipe];
      updateRecipes(narrowSearch(searchQuery));
    })
    .catch(function (error) {
      console.error("Error removing element: " + error.message);
    });

  const storageRef = firebase.storage().ref();
  storageRef
    .child(`${currentUid}/images/${recipe}`)
    .delete()
    .then(function () {
      console.log("File deleted successfully.");
    })
    .catch(function (error) {
      console.error("Error deleting file:", error);
    });
}

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

  // Delete acount in auth
  if (uid) {
    uid
      .delete()
      .then(function () {
        // User deleted.
        console.log("User account deleted successfully.");
      })
      .catch(function (error) {
        // An error happened.
        console.error("Error deleting user account:", error);
      });
  } else {
    // No user is signed in.
    console.log("No user is currently signed in.");
  }
}

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
