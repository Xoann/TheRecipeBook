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
  const imageURLs = getImageURLs(recipeNames, currentUid);

  for (let i = 0; i < recipeNames.length; i++) {
    generateRecipeModal(recipeNames[i]);

    const recipeContainer =
      document.getElementsByClassName("recipe-container")[0];

    // Recipe card menu
    // const menuContainer = document.createElement("div");
    // menuContainer.classList.add("menu-container");

    const menu = document.createElement("div");
    menu.classList.add("menu");

    const shoppingDiv = document.createElement("div");
    shoppingDiv.classList.add("slideout-menu-btn");
    const shoppingText = document.createElement("p");
    shoppingText.textContent = "Shop";
    shoppingText.classList.add("btn-text");

    shoppingDiv.append(shoppingText);

    const editDiv = document.createElement("div");
    editDiv.classList.add("slideout-menu-btn");
    const editText = document.createElement("p");
    editText.textContent = "Edit";
    editText.classList.add("btn-text");

    editDiv.append(editText);

    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("slideout-menu-btn");
    const deleteText = document.createElement("p");
    deleteText.textContent = "Delete";
    deleteText.classList.add("btn-text");

    deleteDiv.append(deleteText);

    const slideoutMenuMask = document.createElement("div");
    slideoutMenuMask.classList.add("slideout-menu-mask");

    const slideoutMenu = document.createElement("div");
    slideoutMenu.classList.add("slideout-menu");
    slideoutMenu.id = `slideout-menu-${recipeNames[i]}`;
    slideoutMenu.appendChild(shoppingDiv);
    slideoutMenu.appendChild(editDiv);
    slideoutMenu.appendChild(deleteDiv);
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

        function toggleAnimation() {
          svgElement.classList.toggle("x");
        }

        svgElement.addEventListener("click", toggleAnimation);
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
    // TODO Make a close menu function that handles animation and class list stuff
    recipeCardMenuBtn.addEventListener("click", () => {
      const clickedMenu = document.getElementById(
        `slideout-menu-${recipeNames[i]}`
      );
      clickedMenu.classList.toggle("sliding-menu-transition");

      const otherMenus = document.getElementsByClassName("slideout-menu");
      for (let menu of otherMenus) {
        if (menu !== clickedMenu) {
          menu.classList.remove("sliding-menu-transition");
        }
      }
    });

    recipeCardMenu.appendChild(recipeCardMenuBtn);
    recipeCardMenu.appendChild(slideoutMenuMask);
    // const checkboxDiv = document.createElement("div");
    // checkboxDiv.classList.add("checkbox-div");
    // checkboxDiv.id = `checkbox_${recipeNames[i]}`;

    // if (!checkboxStatus.hasOwnProperty(`checkbox_${recipeNames[i]}`)) {
    //   checkboxStatus[recipeNames[i]] = false;
    // }

    // const check = document.createElement("div");
    // check.classList.add("check");
    // check.id = `checkbox_${recipeNames[i]}`;

    // // I'm almost positive this prevents a bug (maybe)
    // checkboxDiv.addEventListener("click", function () {
    //   handleShoppingCheckbox(recipeNames[i], check);
    // });

    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-div");

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

    // recipeDiv.appendChild(checkboxDiv);
    // checkboxDiv.appendChild(check);
    // recipeDiv.appendChild(menuButtonDiv);
    // // recipeDiv.appendChild(menuContainer);
    // recipeDiv.appendChild(menu);
    recipeDiv.appendChild(recipeCardMenu);
    // menu.appendChild(shoppingDiv);
    // menu.appendChild(editDiv);
    // menu.appendChild(deleteDiv);
    // checkboxDiv.appendChild(shoppingListCheckBox);
    // checkboxDiv.appendChild(shoppingListCheckboxLabel);
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

function generateRecipeModal(recipeName) {
  const uid = firebase.auth().currentUid;
  const recipe = recipes[recipeName];
  const description = recipe.recipeDesc;
  const steps = recipe.steps;
  const ingredients = recipe.ingredients;
  const prepTimeHrs = recipe.prepTimeHrs;
  const prepTimeMins = recipe.prepTimeMins;

  const modalElement = document.createElement("div");
  modalElement.classList.add("modal");
  modalElement.id = recipeName;

  const modalContentElement = document.createElement("div");
  modalContentElement.classList.add("modal-content");

  const recipeNameElement = document.createElement("h2");
  recipeNameElement.classList.add("modal-recipe-name");
  recipeNameElement.textContent = recipeName;

  const descriptionElement = document.createElement("h2");
  descriptionElement.classList.add("modal-description");
  descriptionElement.textContent = description;

  const prepTimeContainer = document.createElement("div");
  prepTimeContainer.classList.add("prep-time-container");

  const prepTimeLabel = document.createElement("label");
  prepTimeLabel.classList.add("detail-label");
  prepTimeLabel.textContent = "Prep Time";

  const prepTimeHrsElement = document.create;

  const closeModalButton = document.createElement("span");
  closeModalButton.id = "closeModalButton";
  closeModalButton.textContent = "Close";

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
  modalContentElement.appendChild(descriptionElement);
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

function handleShoppingCheckbox(recipeName, check) {
  if (!checkboxStatus[recipeName]) {
    shoppingList.push(recipeName);
    check.classList.add("show");
  } else {
    const idxToRemove = shoppingList.indexOf(recipeName);
    if (idxToRemove !== -1) {
      shoppingList.splice(idxToRemove, 1);
    }
    check.classList.remove("show");
  }
  checkboxStatus[recipeName] = !checkboxStatus[recipeName];
  console.log(shoppingList);
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
