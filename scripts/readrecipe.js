import { displayRecipes } from "./functions.js";
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

// function displayRecipes(recipeNames) {
//   console.log(recipeNames);

//   const imageURLs = getImageURLs(recipeNames, currentUid);

//   for (let i = 0; i < recipeNames.length; i++) {
//     generateRecipeModal(recipeNames[i], imageURLs);
//     generateEditModal(recipeNames[i], imageURLs);

//     const recipeContainer =
//       document.getElementsByClassName("recipe-container")[0];

//     // Recipe card menu
//     // const menuContainer = document.createElement("div");
//     // menuContainer.classList.add("menu-container");
//     const recipeDiv = document.createElement("div");
//     recipeDiv.classList.add("recipe-div");
//     recipeDiv.id = `${recipeNames[i]}-recipe-div`;

//     const menu = document.createElement("div");
//     menu.classList.add("menu");

//     const shoppingDiv = document.createElement("div");
//     shoppingDiv.classList.add("slideout-menu-btn");
//     const shoppingText = document.createElement("p");
//     shoppingText.id = `shopping-btn-text-${recipeNames[i]}`;
//     shoppingText.textContent = "Add";
//     shoppingText.classList.add("btn-text");

//     shoppingText.classList.add("add-button");
//     if (shoppingList.includes(recipeNames[i])) {
//       shoppingText.classList.add("shop-added");
//     }

//     shoppingText.id = `shop-text-${recipeNames[i]}`;

//     shoppingDiv.addEventListener("click", () => {
//       handleShoppingToggle(recipeNames[i]);
//     });

//     fetch("../svgs/shop.svg")
//       .then((response) => response.text())
//       .then((svgData) => {
//         const parser = new DOMParser();
//         const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
//         const svgElement = svgDOM.querySelector("svg");
//         svgElement.id = `shop-icon-${recipeNames[i]}`;

//         svgElement.classList.add("add-svg");
//         if (shoppingList.includes(recipeNames[i])) {
//           svgElement.classList.add("shop-added");
//         }

//         checkRecipeInDbList(recipeNames[i], svgElement, shoppingText);
//         shoppingDiv.appendChild(svgElement);
//         shoppingDiv.append(shoppingText);
//       })
//       .catch((error) => {
//         console.error("Error loading SVG:", error);
//       });

//     const editDiv = document.createElement("div");
//     editDiv.classList.add("slideout-menu-btn");
//     const editText = document.createElement("p");
//     editText.textContent = "Edit";
//     editText.classList.add("btn-text");

//     fetch("../svgs/edit.svg")
//       .then((response) => response.text())
//       .then((svgData) => {
//         const parser = new DOMParser();
//         const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
//         const svgElement = svgDOM.querySelector("svg");
//         editDiv.appendChild(svgElement);
//         editDiv.append(editText);
//       })
//       .catch((error) => {
//         console.error("Error loading SVG:", error);
//       });

//     editDiv.addEventListener("click", function () {
//       displayRecipeModal(`${recipeNames[i]}-edit`);
//       fillEditInputs(recipeNames[i], imageURLs);
//     });

//     const deleteDiv = document.createElement("div");
//     deleteDiv.classList.add("slideout-menu-btn");
//     deleteDiv.classList.add("delete-recipe-btn");
//     const deleteText = document.createElement("p");
//     deleteText.textContent = "Del";
//     deleteText.classList.add("btn-text");

//     deleteDiv.addEventListener("click", () => {
//       handleDeleteRecipe(recipeNames[i]);
//     });

//     fetch("../svgs/trash.svg")
//       .then((response) => response.text())
//       .then((svgData) => {
//         const parser = new DOMParser();
//         const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
//         const svgElement = svgDOM.querySelector("svg");
//         deleteDiv.appendChild(svgElement);
//         deleteDiv.append(deleteText);
//       })
//       .catch((error) => {
//         console.error("Error loading SVG:", error);
//       });

//     const extraSpace = document.createElement("div");
//     extraSpace.classList.add("extra-menu-spacer");
//     extraSpace.text = "";

//     const slideoutMenuMask = document.createElement("div");
//     slideoutMenuMask.classList.add("slideout-menu-mask");

//     const slideoutMenu = document.createElement("div");
//     slideoutMenu.classList.add("slideout-menu");
//     slideoutMenu.id = `slideout-menu-${recipeNames[i]}`;
//     slideoutMenu.appendChild(shoppingDiv);
//     slideoutMenu.appendChild(editDiv);
//     slideoutMenu.appendChild(deleteDiv);
//     slideoutMenu.appendChild(extraSpace);
//     slideoutMenuMask.appendChild(slideoutMenu);

//     const menuButtonDiv = document.createElement("div");
//     menuButtonDiv.classList.add("recipe-card-menu-btn");
//     menuButtonDiv.id = "recipe-card-menu-btn";

//     const recipeCardMenu = document.createElement("div");
//     recipeCardMenu.classList.add("recipe-card-menu");

//     const recipeCardMenuBtn = document.createElement("div");
//     recipeCardMenuBtn.classList.add("recipe-card-menu-btn");
//     recipeCardMenuBtn.id = "recipe-card-menu-btn";

//     fetch("../svgs/elipses.svg")
//       .then((response) => response.text())
//       .then((svgData) => {
//         const parser = new DOMParser();
//         const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
//         const svgElement = svgDOM.querySelector("svg");
//         recipeCardMenuBtn.appendChild(svgElement);
//       })
//       .catch((error) => {
//         console.error("Error loading SVG:", error);
//       });
//     // TODO Make a close menu function that handles animation and class list stuff
//     recipeCardMenuBtn.addEventListener("click", () => {
//       handleElipsisBtnPress(recipeNames[i]);
//     });

//     recipeCardMenu.appendChild(recipeCardMenuBtn);
//     recipeCardMenu.appendChild(slideoutMenuMask);

//     recipeDiv.addEventListener("click", function (event) {
//       const goodList = [
//         document.getElementById(`${recipeNames[i]}-overlay`),
//         document.getElementById(`${recipeNames[i]}-recipe-div`),
//         document.getElementById(`${recipeNames[i]}-desc-div`),
//         document.getElementById(`${recipeNames[i]}-recipe-name`),
//         document.getElementById(`${recipeNames[i]}-recipe-elements`),
//         document.getElementById(`${recipeNames[i]}-top-elements`),
//       ];
//       // console.log(event.target);
//       const isCardClicked = goodList.includes(event.target);
//       if (isCardClicked) {
//         displayRecipeModal(recipeNames[i]);
//       }
//     });

//     const imgContainer = document.createElement("div");
//     imgContainer.classList.add("img-container");

//     const recipeImg = document.createElement("img");
//     recipeImg.classList.add("recipe-img");
//     loadImg(recipeImg, imageURLs, recipeNames[i]);

//     const gradientOverlay = document.createElement("div");
//     gradientOverlay.classList.add("gradient-overlay");
//     gradientOverlay.id = `${recipeNames[i]}-overlay`;

//     const recipeElements = document.createElement("div");
//     recipeElements.classList.add("recipe-elements");
//     recipeElements.id = `${recipeNames[i]}-recipe-elements`;

//     const topElements = document.createElement("div");
//     topElements.classList.add("top-elements");
//     topElements.id = `${recipeNames[i]}-top-elements`;

//     const recipeNameElement = document.createElement("h2");
//     recipeNameElement.classList.add("recipe-name");
//     recipeNameElement.id = `${recipeNames[i]}-recipe-name`;
//     recipeNameElement.textContent = recipeNames[i];

//     const recipeDescription = document.createElement("div");
//     recipeDescription.classList.add("desc-div");
//     recipeDescription.id = `${recipeNames[i]}-desc-div`;
//     recipeDescription.innerHTML = recipes[recipeNames[i]].recipeDesc;

//     recipeContainer.appendChild(recipeDiv);
//     recipeDiv.appendChild(imgContainer);
//     imgContainer.appendChild(recipeImg);
//     imgContainer.appendChild(gradientOverlay);
//     recipeDiv.appendChild(recipeElements);
//     recipeElements.appendChild(topElements);
//     topElements.appendChild(recipeNameElement);
//     recipeElements.appendChild(recipeDescription);
//     recipeDiv.appendChild(recipeCardMenu);
//   }
// }

async function loadImg(imgElement, imgURLs, imageName) {
  const imageURLs = await imgURLs;
  const imageURL = await imageURLs[imageName];
  imgElement.src = imageURL;
}

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

// async function generateRecipeModal(recipeName, imageURLs) {
//   const recipe = recipes[recipeName];

//   const modalElement = document.createElement("div");
//   modalElement.classList.add("modal");
//   modalElement.id = recipeName;

//   const modalContentElement = document.createElement("div");
//   modalContentElement.classList.add("modal-content");

//   //Name
//   const recipeNameElement = document.createElement("h2");
//   recipeNameElement.classList.add("modal-recipe-name");
//   recipeNameElement.textContent = recipeName;

//   //Image
//   const image = document.createElement("img");
//   image.classList.add("image");
//   loadImg(image, imageURLs, recipeName);

//   //Description

//   const descriptionDiv = document.createElement("div");
//   descriptionDiv.classList.add("description-div");

//   const descriptionElement = document.createElement("h2");
//   descriptionElement.classList.add("modal-description");
//   descriptionElement.textContent = recipe.recipeDesc;
//   descriptionDiv.appendChild(descriptionElement);

//   //Prep Time
//   const prepTimeLabel = document.createElement("label");
//   prepTimeLabel.classList.add("detail-label");
//   let prepHrsMsg = `${recipe.prepTimeHrs} hrs`;
//   let prepMinsMsg = `${recipe.prepTimeMins} mins`;

//   if (recipe.prepTimeHrs === "0") {
//     prepHrsMsg = "";
//   } else if (recipe.prepTimeHrs === "1") {
//     prepHrsMsg = "1 hr";
//   }

//   if (recipe.prepTimeMins === "0") {
//     prepMinsMsg = "";
//   } else if (recipe.prepTimeMins === "1") {
//     prepMinsMsg = "1 min";
//   }

//   prepTimeLabel.textContent = `Prep Time: ${prepHrsMsg} ${prepMinsMsg}`;

//   //Cook Time
//   const cookTimeLabel = document.createElement("label");
//   cookTimeLabel.classList.add("detail-label");
//   let cookHrsMsg = `${recipe.cookTimeHrs} hrs`;
//   let cookMinsMsg = `${recipe.cookTimeMins} mins`;

//   if (recipe.cookTimeHrs === "0") {
//     cookHrsMsg = "";
//   } else if (recipe.cookTimeHrs === "1") {
//     cookHrsMsg = "1 hr";
//   }

//   if (recipe.cookTimeMins === "0") {
//     cookMinsMsg = "";
//   } else if (recipe.cookTimeMins === "1") {
//     cookMinsMsg = "1 min";
//   }

//   cookTimeLabel.textContent = `Cook Time: ${cookHrsMsg} ${cookMinsMsg}`;

//   //Servings

//   const servingsContainer = document.createElement("div");
//   servingsContainer.classList.add("servings-container");

//   const servingsLabel = document.createElement("label");
//   servingsLabel.classList.add("detail-label");
//   servingsLabel.textContent = "Servings:";
//   servingsContainer.appendChild(servingsLabel);

//   const servingsInput = document.createElement("input");
//   servingsInput.classList.add("servings-input");
//   servingsInput.value = `${recipe.servings}`;

//   //Recalculate ingredient amounts
//   function recalculateIngredients() {
//     let ingredientValueElements = document.getElementsByClassName(
//       `ingredient_${recipeName.replace(/ /g, "-")}`
//     );
//     let numServings = servingsInput.value;
//     let origServings = Number(recipe.servings);

//     for (let i = 0; i < recipe.ingredients.length; i++) {
//       let ingredientString = recipe.ingredients[i].value;
//       let ingredientValue;

//       ingredientValue = multiplyFractionByNumber(
//         ingredientString,
//         numServings,
//         origServings
//       );
//       ingredientValueElements[i].textContent = ingredientValue;
//     }
//   }

//   fetch("../svgs/minus.svg")
//     .then((response) => response.text())
//     .then((svgData) => {
//       const parser = new DOMParser();
//       const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
//       const svgElement = svgDOM.querySelector("svg");
//       svgElement.classList.add("servings-button");
//       servingsContainer.appendChild(svgElement);

//       servingsContainer.appendChild(servingsInput);

//       svgElement.addEventListener("click", function () {
//         servingsInput.value = servingsInput.value - 1;
//         recalculateIngredients();
//       });
//     })
//     .catch((error) => {
//       console.error("Error loading SVG:", error);
//     });

//   fetch("../svgs/plus.svg")
//     .then((response) => response.text())
//     .then((svgData) => {
//       const parser = new DOMParser();
//       const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
//       const svgElement = svgDOM.querySelector("svg");
//       svgElement.classList.add("servings-button");
//       servingsContainer.appendChild(svgElement);

//       svgElement.addEventListener("click", function () {
//         servingsInput.value = Number(servingsInput.value) + 1;
//         recalculateIngredients();
//       });
//     })
//     .catch((error) => {
//       console.error("Error loading SVG:", error);
//     });

//   const detailsContainer = document.createElement("div");
//   detailsContainer.classList.add("details-container");
//   detailsContainer.appendChild(prepTimeLabel);
//   detailsContainer.appendChild(cookTimeLabel);
//   detailsContainer.appendChild(servingsContainer);

//   //Ingredients
//   const ingredientsStepsContainer = document.createElement("div");
//   ingredientsStepsContainer.classList.add("ingredients-steps-container");

//   const ingredientLabel = document.createElement("h3");
//   ingredientLabel.classList.add("med-label");
//   ingredientLabel.innerText = "Ingredients:";

//   const ingredientsContainer = document.createElement("ul");
//   ingredientsContainer.appendChild(ingredientLabel);
//   ingredientsContainer.classList.add("ingredients-container");
//   for (let ingredient of recipe.ingredients) {
//     const ingredientElement = document.createElement("li");
//     ingredientElement.classList.add("ingredient-element");

//     const ingredientDiv = document.createElement("div");
//     ingredientDiv.classList.add("ingredient-div");

//     let ingredientValue = document.createElement("h3");
//     let ingredientNameUnit = document.createElement("h3");

//     ingredientValue.textContent = ingredient.value;
//     ingredientNameUnit.textContent = `${ingredient.unit} ${ingredient.name}`;

//     ingredientValue.classList.add("ingredient");
//     ingredientValue.classList.add("ingredient-value");
//     ingredientValue.classList.add(
//       `ingredient_${recipeName.replace(/ /g, "-")}`
//     );
//     ingredientNameUnit.classList.add("ingredient");

//     if (ingredient.value.length === 0) {
//       ingredientNameUnit.classList.add("no-value");
//     }

//     //ingredientValue.classList.add(`${recipeName}-ingredient`);

//     ingredientDiv.appendChild(ingredientValue);

//     ingredientDiv.appendChild(ingredientNameUnit);

//     ingredientElement.appendChild(ingredientDiv);

//     ingredientsContainer.appendChild(ingredientElement);
//   }

//   ingredientsStepsContainer.appendChild(ingredientsContainer);

//   //Steps

//   const stepLabel = document.createElement("h3");
//   stepLabel.classList.add("med-label");
//   stepLabel.innerText = "Steps:";

//   const stepsContainer = document.createElement("ul");
//   stepsContainer.appendChild(stepLabel);
//   stepsContainer.classList.add("steps-container");
//   for (let step of recipe.steps) {
//     const stepElement = document.createElement("li");
//     stepElement.classList.add("step");
//     stepElement.textContent = `${step}`;
//     stepsContainer.appendChild(stepElement);
//   }

//   ingredientsStepsContainer.appendChild(stepsContainer);

//   //Close Button
//   fetch("../svgs/x.svg")
//     .then((response) => response.text())
//     .then((svgData) => {
//       const parser = new DOMParser();
//       const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
//       const svgElement = svgDOM.querySelector("svg");
//       svgElement.classList.add("close-button");
//       modalContentElement.appendChild(svgElement);

//       svgElement.addEventListener("click", function () {
//         closeModal(modalElement);
//       });
//     })
//     .catch((error) => {
//       console.error("Error loading SVG:", error);
//     });

//   window.addEventListener("click", (event) => {
//     if (event.target === modalElement) {
//       closeModal(modalElement);
//     }
//   });

//   const documentBody = document.getElementById("body");

//   documentBody.appendChild(modalElement);
//   modalElement.appendChild(modalContentElement);

//   modalContentElement.appendChild(recipeNameElement);
//   modalContentElement.appendChild(image);
//   modalContentElement.appendChild(descriptionDiv);
//   modalContentElement.appendChild(detailsContainer);
//   modalContentElement.appendChild(ingredientsStepsContainer);
// }

// Modal window interactivity

// function displayRecipeModal(modalId) {
//   const modal = document.getElementById(modalId);
//   openModal(modal);
// }

// function openModal(modal) {
//   modal.style.display = "block";
//   document.getElementById("body").classList.add("body-modal-open");
//   modal.scrollTop = "0";
// }

// function closeModal(modal) {
//   modal.style.display = "none";
//   document.getElementById("body").classList.remove("body-modal-open");
// }

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

//     shoppingModalContent.appendChild(ingredientNameElement);
//   }
// }

// function multiplyFractionByNumber(fractionString, numerator, denominator) {
//   if (fractionString.length === 0) {
//     return fractionString;
//   }

//   if (fractionString.indexOf("/") === -1) {
//     fractionString = fractionString + "/1";
//   }

//   // Extract numerator and denominator from the fraction string
//   const [fractionNumerator, fractionDenominator] = fractionString.split("/");

//   // Convert the extracted parts to numbers
//   const parsedNumerator = parseFloat(fractionNumerator);
//   const parsedDenominator = parseFloat(fractionDenominator);

//   // Check if parsing was successful
//   if (isNaN(parsedNumerator) || isNaN(parsedDenominator)) {
//     console.log("Invalid fraction format");
//     return NaN;
//   }

//   // Multiply the fraction by the given numerator and denominator
//   const resultNumerator = parsedNumerator * numerator;
//   const resultDenominator = parsedDenominator * denominator;

//   // Return the result as a simplified fraction
//   return simplifyFraction(resultNumerator, resultDenominator);
// }

// Function to simplify a fraction
// function simplifyFraction(numerator, denominator) {
//   const gcd = calculateGCD(numerator, denominator);
//   const simplifiedNumerator = numerator / gcd;
//   const simplifiedDenominator = denominator / gcd;
//   if (simplifiedDenominator === 1) {
//     return `${simplifiedNumerator}`;
//   } else if (simplifiedNumerator > simplifiedDenominator) {
//     let whole =
//       (simplifiedNumerator - (simplifiedNumerator % simplifiedDenominator)) /
//       simplifiedDenominator;
//     let fractionNumerator = simplifiedNumerator % simplifiedDenominator;
//     return `${whole} ${fractionNumerator}/${simplifiedDenominator}`;
//   } else {
//     return `${simplifiedNumerator}/${simplifiedDenominator}`;
//   }
// }

// Function to calculate the Greatest Common Divisor (GCD)
// function calculateGCD(a, b) {
//   return b === 0 ? a : calculateGCD(b, a % b);
// }

// function handleElipsisBtnPress(recipeName) {
//   const clickedMenu = document.getElementById(`slideout-menu-${recipeName}`);
//   clickedMenu.classList.toggle("sliding-menu-transition");

//   const otherMenus = document.getElementsByClassName("slideout-menu");
//   for (let menu of otherMenus) {
//     if (menu !== clickedMenu) {
//       menu.classList.remove("sliding-menu-transition");
//     }
//   }
// }

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

// function handleDeleteRecipe(recipeName) {
//   // Modify delete modal
//   const deleteModalText = document.getElementById("delete-modal-text");
//   deleteModalText.textContent = `Are you sure you want to delete your ${recipeName} recipe?`;

//   // Display delete modal
//   const modal = document.getElementById("delete-modal");
//   openModal(modal);

//   window.addEventListener("click", (event) => {
//     if (event.target === modal) {
//       closeModal(modal);
//     }
//   });

//   const deleteAcountBtn = document.getElementById("delete-recipe-final-btn");

//   deleteAcountBtn.addEventListener("click", () => {
//     deleteRecipe(recipeName);
//     closeModal(modal);
//   });
// }

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
