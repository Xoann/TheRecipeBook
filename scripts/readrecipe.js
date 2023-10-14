var currentUid;
let recipes;
let searchQuery = "";
const navbarHoverColor = "#2b2c2e";

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
  const imageURLs = getImageURLs(recipeNames, currentUid);

  for (let i = 0; i < recipeNames.length; i++) {
    generateRecipeModal(recipeNames[i], imageURLs);

    const recipeContainer =
      document.getElementsByClassName("recipe-container")[0];

    const shoppingListCheckBox = document.createElement("input");
    shoppingListCheckBox.type = "checkbox";
    shoppingListCheckBox.classList.add("shopping-checkbox");
    shoppingListCheckBox.id = `checkbox_${recipeNames[i]}`;

    // I'm almost positive this prevents a bug (maybe)
    shoppingListCheckBox.addEventListener("change", function () {
      handleShoppingCheckbox(shoppingListCheckBox);
    });

    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-div");

    recipeDiv.addEventListener("click", function (event) {
      if (event.target !== shoppingListCheckBox) {
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
    recipeElements.appendChild(recipeNameElement);
    recipeElements.appendChild(recipeDescription);
    recipeElements.appendChild(shoppingListCheckBox);
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
    if (recipe.includes(search)) {
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
  searchQuery = event.target.value;

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
  const servingsLabel = document.createElement("label");
  servingsLabel.classList.add("detail-label");
  servingsLabel.textContent = `Servings: ${recipe.servings}`;

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details-container");
  detailsContainer.appendChild(prepTimeLabel);
  detailsContainer.appendChild(cookTimeLabel);
  detailsContainer.appendChild(servingsLabel);

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
    ingredientElement.classList.add("ingredient");
    ingredientElement.textContent = `${ingredient.value} ${ingredient.unit} ${ingredient.name}`;
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

function handleShoppingCheckbox(checkbox) {
  const checkedRecipe = checkbox.id.slice(9);
  if (checkbox.checked) {
    shoppingList.push(checkedRecipe);
  } else {
    const idxToRemove = shoppingList.indexOf(checkedRecipe);
    if (idxToRemove !== -1) {
      shoppingList.splice(idxToRemove, 1);
    }
  }
  // console.log(shoppingList);
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

// testing
// document.getElementById("hh").addEventListener("click", combineIngredients);

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
      if (!shoppingIngredientObject.hasOwnProperty(ingredient)) {
        shoppingIngredientObject[ingredient] = convertToMl(
          recipeIngredients[i]
        );
      } else {
        shoppingIngredientObject[ingredient] += convertToMl(
          recipeIngredients[i]
        );
      }

      // Add to prefferedIngredientUnit
      if (!prefferedIngredientUnit.hasOwnProperty(ingredientUnit)) {
        prefferedIngredientUnit[ingredient] = ingredientUnit;
      }
    }
  }
  // console.log(prefferedIngredientUnit);
  // console.log(shoppingIngredientObject);
  return [shoppingIngredientObject, prefferedIngredientUnit];
}

function convertToMl(ingredient) {
  return ingredient["value"] * volUnitsToMl[ingredient["unit"]];
}

function convertMlToOther(mlValue, unit) {
  return (mlValue / volUnitsToMl[unit]).toFixed(2);
}

function updateShoppingListModal() {
  const shoppingModalContent = document.getElementById(
    "shopping-list-modal-content"
  );
  shoppingModalContent.innerHTML = "";

  const ingComb = combineIngredients();
  const ingredientObjects = ingComb[0];
  const ingredients = Object.keys(ingredientObjects);
  const prefferedIngredientUnit = ingComb[1];

  for (const ingredient of ingredients) {
    const unit = prefferedIngredientUnit[ingredient];
    const ingredientValue = convertMlToOther(
      ingredientObjects[ingredient],
      unit
    );

    const ingredientNameElement = document.createElement("h3");
    ingredientNameElement.textContent = `${ingredient} ${ingredientValue} ${unit}`;

    shoppingModalContent.appendChild(ingredientNameElement);
  }
}

// BUG Shopping list doesnt reset when you select a recipe after searching it
// BUG Checkboxes don't data persist when searching recipes
