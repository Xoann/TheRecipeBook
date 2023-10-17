var currentUid;
let recipes;
let searchQuery = "";
const navbarHoverColor = "#2b2c2e";
let checkboxStatus = {};

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
      displayRecipes(imageNames);
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

function displayRecipes(recipeNames) {
  console.log(recipeNames);
  const imageURLs = getImageURLs(recipeNames, currentUid);

  for (let i = 0; i < recipeNames.length; i++) {
    generateRecipeModal(recipeNames[i], imageURLs);

    const recipeContainer =
      document.getElementsByClassName("recipe-container")[0];

    // Recipe card menu
    // const menuContainer = document.createElement("div");
    // menuContainer.classList.add("menu-container");
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-div");

    const menu = document.createElement("div");
    menu.classList.add("menu");

    const shoppingDiv = document.createElement("div");
    shoppingDiv.classList.add("slideout-menu-btn");
    const shoppingText = document.createElement("p");
    shoppingText.textContent = "Add";
    shoppingText.classList.add("btn-text");
    if (shoppingList.includes(recipeNames[i])) {
      shoppingText.classList.add("shop-added");
    }
    shoppingText.id = `shop-text-${recipeNames[i]}`;

    shoppingDiv.addEventListener("click", () => {
      handleShoppingCheckbox(recipeNames[i]);
    });

    fetch("../svgs/shop.svg")
      .then((response) => response.text())
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
        const svgElement = svgDOM.querySelector("svg");
        svgElement.id = `shop-icon-${recipeNames[i]}`;
        if (shoppingList.includes(recipeNames[i])) {
          svgElement.classList.add("shop-added");
        }
        shoppingDiv.appendChild(svgElement);
        shoppingDiv.append(shoppingText);
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });

    const editDiv = document.createElement("div");
    editDiv.classList.add("slideout-menu-btn");
    const editText = document.createElement("p");
    editText.textContent = "Edit";
    editText.classList.add("btn-text");

    fetch("../svgs/edit.svg")
      .then((response) => response.text())
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
        const svgElement = svgDOM.querySelector("svg");
        editDiv.appendChild(svgElement);
        editDiv.append(editText);
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });

    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("slideout-menu-btn");
    deleteDiv.classList.add("delete-recipe-btn");
    const deleteText = document.createElement("p");
    deleteText.textContent = "Del";
    deleteText.classList.add("btn-text");

    deleteDiv.addEventListener("click", () => {
      handleDeleteRecipe(recipeNames[i]);
    });

    fetch("../svgs/trash.svg")
      .then((response) => response.text())
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
        const svgElement = svgDOM.querySelector("svg");
        deleteDiv.appendChild(svgElement);
        deleteDiv.append(deleteText);
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });

    const extraSpace = document.createElement("div");
    extraSpace.classList.add("extra-menu-spacer");
    extraSpace.text = "";

    const slideoutMenuMask = document.createElement("div");
    slideoutMenuMask.classList.add("slideout-menu-mask");

    const slideoutMenu = document.createElement("div");
    slideoutMenu.classList.add("slideout-menu");
    slideoutMenu.id = `slideout-menu-${recipeNames[i]}`;
    slideoutMenu.appendChild(shoppingDiv);
    slideoutMenu.appendChild(editDiv);
    slideoutMenu.appendChild(deleteDiv);
    slideoutMenu.appendChild(extraSpace);
    slideoutMenuMask.appendChild(slideoutMenu);

    const menuButtonDiv = document.createElement("div");
    menuButtonDiv.classList.add("recipe-card-menu-btn");
    menuButtonDiv.id = "recipe-card-menu-btn";

    const recipeCardMenu = document.createElement("div");
    recipeCardMenu.classList.add("recipe-card-menu");

    const recipeCardMenuBtn = document.createElement("div");
    recipeCardMenuBtn.classList.add("recipe-card-menu-btn");
    recipeCardMenuBtn.id = "recipe-card-menu-btn";

    fetch("../svgs/elipses.svg")
      .then((response) => response.text())
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
        const svgElement = svgDOM.querySelector("svg");
        recipeCardMenuBtn.appendChild(svgElement);
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
    // TODO Make a close menu function that handles animation and class list stuff
    recipeCardMenuBtn.addEventListener("click", () => {
      handleElipsisBtnPress(recipeNames[i]);
    });

    recipeCardMenu.appendChild(recipeCardMenuBtn);
    recipeCardMenu.appendChild(slideoutMenuMask);

    recipeDiv.addEventListener("click", function (event) {
      if (event.target === recipeDiv) {
        //FIXME
        console.log(event.target);
        displayRecipeModal(recipeNames[i]);
      }
    });

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const recipeImg = document.createElement("img");
    recipeImg.classList.add("recipe-img");
    loadImg(recipeImg, imageURLs, recipeNames[i]);

    const gradientOverlay = document.createElement("div");
    gradientOverlay.classList.add("gradient-overlay");

    const recipeElements = document.createElement("div");
    recipeElements.classList.add("recipe-elements");

    const topElements = document.createElement("div");
    topElements.classList.add("top-elements");

    const recipeNameElement = document.createElement("h2");
    recipeNameElement.classList.add("recipe-name");
    recipeNameElement.textContent = recipeNames[i];

    const recipeDescription = document.createElement("div");
    recipeDescription.classList.add("desc-div");
    recipeDescription.innerHTML = recipes[recipeNames[i]].recipeDesc;

    recipeContainer.appendChild(recipeDiv);
    recipeDiv.appendChild(imgContainer);
    imgContainer.appendChild(recipeImg);
    imgContainer.appendChild(gradientOverlay);
    recipeDiv.appendChild(recipeElements);
    recipeElements.appendChild(topElements);
    topElements.appendChild(recipeNameElement);
    recipeElements.appendChild(recipeDescription);
    recipeDiv.appendChild(recipeCardMenu);
  }
}

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
  displayRecipes(recipeNames);
}

searchInput.addEventListener("input", function (event) {
  searchQuery = event.target.value.toLowerCase();

  const searchedRecipeNames = narrowSearch(searchQuery);
  updateRecipes(searchedRecipeNames);
});

//////////////////////////////
/// Generate Recipe Modals ///
//////////////////////////////

async function generateRecipeModal(recipeName, imageURLs) {
  const recipe = recipes[recipeName];
  const numIngredients = recipe.ingredients.length;
  const numSteps = recipe.steps.length;

  const modalElement = document.createElement("div");
  modalElement.classList.add("modal");
  modalElement.id = recipeName;

  const modalContentElement = document.createElement("div");
  modalContentElement.classList.add("modal-content");

  //Name
  const recipeNameElement = document.createElement("h2");
  recipeNameElement.classList.add("modal-recipe-name");
  recipeNameElement.textContent = recipeName;

  //Image
  const image = document.createElement("img");
  image.classList.add("image");
  loadImg(image, imageURLs, recipeName);

  //Description

  const descriptionDiv = document.createElement("div");
  descriptionDiv.classList.add("description-div");

  const descriptionElement = document.createElement("h2");
  descriptionElement.classList.add("modal-description");
  descriptionElement.textContent = recipe.recipeDesc;
  descriptionDiv.appendChild(descriptionElement);

  //Prep Time
  const prepTimeLabel = document.createElement("label");
  prepTimeLabel.classList.add("detail-label");
  let prepHrsMsg = `${recipe.prepTimeHrs} hrs`;
  let prepMinsMsg = `${recipe.prepTimeMins} mins`;

  if (recipe.prepTimeHrs === "0") {
    prepHrsMsg = "";
  } else if (recipe.prepTimeHrs === "1") {
    prepHrsMsg = "1 hr";
  }

  if (recipe.prepTimeMins === "0") {
    prepMinsMsg = "";
  } else if (recipe.prepTimeMins === "1") {
    prepMinsMsg = "1 min";
  }

  prepTimeLabel.textContent = `Prep Time: ${prepHrsMsg} ${prepMinsMsg}`;

  //Cook Time
  const cookTimeLabel = document.createElement("label");
  cookTimeLabel.classList.add("detail-label");
  let cookHrsMsg = `${recipe.cookTimeHrs} hrs`;
  let cookMinsMsg = `${recipe.cookTimeMins} mins`;

  if (recipe.cookTimeHrs === "0") {
    cookHrsMsg = "";
  } else if (recipe.cookTimeHrs === "1") {
    cookHrsMsg = "1 hr";
  }

  if (recipe.cookTimeMins === "0") {
    cookMinsMsg = "";
  } else if (recipe.cookTimeMins === "1") {
    cookMinsMsg = "1 min";
  }

  cookTimeLabel.textContent = `Cook Time: ${cookHrsMsg} ${cookMinsMsg}`;

  //Servings

  const servingsContainer = document.createElement("div");
  servingsContainer.classList.add("servings-container");

  const servingsLabel = document.createElement("label");
  servingsLabel.classList.add("detail-label");
  servingsLabel.textContent = "Servings:";
  servingsContainer.appendChild(servingsLabel);

  const servingsInput = document.createElement("input");
  servingsInput.id = "servings-input";
  servingsInput.value = `${recipe.servings}`;

  //Recalculate ingredient amounts
  function recalculateIngredients() {
    let ingredientValueElements = document.getElementsByClassName(
      `ingredient_${recipeName.replace(/ /g, "-")}`
    );
    let numServings = servingsInput.value;
    let origServings = Number(recipe.servings);

    for (let i = 0; i < recipe.ingredients.length; i++) {
      let ingredientString = recipe.ingredients[i].value;
      let ingredientValue;

      ingredientValue = multiplyFractionByNumber(
        ingredientString,
        numServings,
        origServings
      );
      ingredientValueElements[i].textContent = ingredientValue;
    }
  }

  fetch("../svgs/minus.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      const svgElement = svgDOM.querySelector("svg");
      svgElement.classList.add("servings-button");
      servingsContainer.appendChild(svgElement);

      servingsContainer.appendChild(servingsInput);

      svgElement.addEventListener("click", function () {
        servingsInput.value = servingsInput.value - 1;
        recalculateIngredients();
      });
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
    });

  fetch("../svgs/plus.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      const svgElement = svgDOM.querySelector("svg");
      svgElement.classList.add("servings-button");
      servingsContainer.appendChild(svgElement);

      svgElement.addEventListener("click", function () {
        servingsInput.value = Number(servingsInput.value) + 1;
        recalculateIngredients();
      });
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
    });

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details-container");
  detailsContainer.appendChild(prepTimeLabel);
  detailsContainer.appendChild(cookTimeLabel);
  detailsContainer.appendChild(servingsContainer);

  //Ingredients
  const ingredientsStepsContainer = document.createElement("div");
  ingredientsStepsContainer.classList.add("ingredients-steps-container");

  const ingredientLabel = document.createElement("h3");
  ingredientLabel.classList.add("med-label");
  ingredientLabel.innerText = "Ingredients:";

  const ingredientsContainer = document.createElement("ul");
  ingredientsContainer.appendChild(ingredientLabel);
  ingredientsContainer.classList.add("ingredients-container");
  for (let ingredient of recipe.ingredients) {
    const ingredientElement = document.createElement("li");
    ingredientElement.classList.add("ingredient-element");

    const ingredientDiv = document.createElement("div");
    ingredientDiv.classList.add("ingredient-div");

    let ingredientValue = document.createElement("h3");
    let ingredientNameUnit = document.createElement("h3");

    ingredientValue.textContent = ingredient.value;
    ingredientNameUnit.textContent = `${ingredient.unit} ${ingredient.name}`;

    ingredientValue.classList.add("ingredient");
    ingredientValue.classList.add("ingredient-value");
    ingredientValue.classList.add(
      `ingredient_${recipeName.replace(/ /g, "-")}`
    );
    ingredientNameUnit.classList.add("ingredient");

    if (ingredient.value.length === 0) {
      ingredientNameUnit.classList.add("no-value");
    }

    //ingredientValue.classList.add(`${recipeName}-ingredient`);

    ingredientDiv.appendChild(ingredientValue);

    ingredientDiv.appendChild(ingredientNameUnit);

    ingredientElement.appendChild(ingredientDiv);

    ingredientsContainer.appendChild(ingredientElement);
  }

  ingredientsStepsContainer.appendChild(ingredientsContainer);

  //Steps

  const stepLabel = document.createElement("h3");
  stepLabel.classList.add("med-label");
  stepLabel.innerText = "Steps:";

  const stepsContainer = document.createElement("ul");
  stepsContainer.appendChild(stepLabel);
  stepsContainer.classList.add("steps-container");
  for (let step of recipe.steps) {
    const stepElement = document.createElement("li");
    stepElement.classList.add("step");
    stepElement.textContent = `${step}`;
    stepsContainer.appendChild(stepElement);
  }

  ingredientsStepsContainer.appendChild(stepsContainer);

  //Close Button
  const closeModalButton = document.createElement("span");
  closeModalButton.id = "closeModalButton";
  closeModalButton.textContent = "Close";
  closeModalButton.classList.add("close");
  closeModalButton.addEventListener("click", () => closeModal(modalElement));

  window.addEventListener("click", (event) => {
    if (event.target === modalElement) {
      closeModal(modalElement);
    }
  });

  const documentBody = document.getElementById("body");

  documentBody.appendChild(modalElement);
  modalElement.appendChild(modalContentElement);
  modalContentElement.appendChild(recipeNameElement);
  modalContentElement.appendChild(image);
  modalContentElement.appendChild(descriptionDiv);
  modalContentElement.appendChild(detailsContainer);
  modalContentElement.appendChild(ingredientsStepsContainer);

  modalContentElement.appendChild(closeModalButton);
}

// Modal window interactivity

function displayRecipeModal(modalId) {
  const modal = document.getElementById(modalId);
  openModal(modal);
}

function openModal(modal) {
  modal.style.display = "block";
}

function closeModal(modal) {
  modal.style.display = "none";
}

///////////////////////////
/// Shopping List Logic ///
///////////////////////////

let shoppingList = [];
const shoppingListButton = document.getElementById("shopping-list");
const shoppingListModal = document.getElementById("shopping-list-modal");

shoppingListButton.addEventListener("click", function () {
  updateShoppingListModal();
  openModal(shoppingListModal);
});

window.addEventListener("click", (event) => {
  if (event.target === shoppingListModal) {
    closeModal(shoppingListModal);
  }
});

function handleShoppingCheckbox(recipeName) {
  if (!checkboxStatus[recipeName]) {
    shoppingList.push(recipeName);
  } else {
    const idxToRemove = shoppingList.indexOf(recipeName);
    if (idxToRemove !== -1) {
      shoppingList.splice(idxToRemove, 1);
    }
  }
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
      console.log(ingredient);
      console.log(shoppingIngredientObject);

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

function deleteRecipe(recipe) {
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
});
