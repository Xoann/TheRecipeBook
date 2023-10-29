import { generateEditModal, fillEditInputs } from "./editrecipe.js";

function createMenu(database, recipeDiv, recipeName) {
  const menu = document.createElement("div");
  menu.classList.add("menu");

  const shoppingDiv = document.createElement("div");
  shoppingDiv.classList.add("slideout-menu-btn");
  const shoppingText = document.createElement("p");
  shoppingText.id = `shopping-btn-text-${recipeName}`;
  shoppingText.textContent = "Add";
  shoppingText.classList.add("btn-text");

  shoppingText.id = `shop-text-${recipeName}`;

  shoppingDiv.addEventListener("click", () => {
    handleShoppingToggle(database, recipeName);
  });

  fetch("../svgs/shop.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      const svgElement = svgDOM.querySelector("svg");
      svgElement.id = `shop-icon-${recipeName}`;

      checkRecipeInDbList(database, recipeName, svgElement, shoppingText);

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

  editDiv.addEventListener("click", function () {
    displayRecipeModal(`${recipeName}-edit`);
    fillEditInputs(database, recipeName);
  });

  const deleteDiv = document.createElement("div");
  deleteDiv.classList.add("slideout-menu-btn");
  deleteDiv.classList.add("delete-recipe-btn");
  const deleteText = document.createElement("p");
  deleteText.textContent = "Del";
  deleteText.classList.add("btn-text");

  deleteDiv.addEventListener("click", () => {
    handleDeleteRecipe(database, recipeName);
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
  slideoutMenu.id = `slideout-menu-${recipeName}`;
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
  recipeCardMenuBtn.addEventListener("click", () => {
    handleElipsisBtnPress(recipeName);
  });

  recipeCardMenu.appendChild(recipeCardMenuBtn);
  recipeCardMenu.appendChild(slideoutMenuMask);
  recipeDiv.appendChild(recipeCardMenu);
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

function handleDeleteRecipe(database, recipeName) {
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
    database.deleteRecipe(recipeName);
    document.getElementById(`${recipeName}-recipe-div`).style.display = "none";
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

export function displayRecipes(database, type, profile = database.user) {
  // Displays recipes as card in the recipe-container DOM element (class)

  // let noRecipes = 0;
  // database.getRecipeCount().then((count) => {
  //   if (count === 0) {
  //     noRecipes = 1;
  //     return;
  //   }
  // });
  // if (noRecipes === 0) {
  //   return;
  // }
  database.getAllRecipeNames(profile).then((recipeNames) => {
    for (let i = 0; i < recipeNames.length; i++) {
      const recipeName = recipeNames[i];

      generateRecipeModal(database, recipeName, profile);
      if (profile === database.user) {
        generateEditModal(database, recipeName);
      }

      const recipeContainer =
        document.getElementsByClassName("recipe-container")[0];

      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe-div");
      recipeDiv.id = `${recipeName}-recipe-div`;

      recipeDiv.addEventListener("click", function (event) {
        const goodList = [
          document.getElementById(`${recipeName}-overlay`),
          document.getElementById(`${recipeName}-recipe-div`),
          document.getElementById(`${recipeName}-desc-div`),
          document.getElementById(`${recipeName}-recipe-name`),
          document.getElementById(`${recipeName}-recipe-elements`),
          document.getElementById(`${recipeName}-top-elements`),
        ];
        const isCardClicked = goodList.includes(event.target);
        if (isCardClicked) {
          displayRecipeModal(recipeName);
        }
      });

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("img-container");

      const recipeImg = document.createElement("img");
      recipeImg.classList.add("recipe-img");

      const forkPromises = [];
      let imageUrl;
      forkPromises.push(
        database.getRecipeImage(recipeName, profile).then((url) => {
          recipeImg.src = url;
          imageUrl = url;
        })
      );

      const gradientOverlay = document.createElement("div");
      gradientOverlay.classList.add("gradient-overlay");
      gradientOverlay.id = `${recipeName}-overlay`;

      const recipeElements = document.createElement("div");
      recipeElements.classList.add("recipe-elements");
      recipeElements.id = `${recipeName}-recipe-elements`;

      const topElements = document.createElement("div");
      topElements.classList.add("top-elements");
      topElements.id = `${recipeName}-top-elements`;

      const recipeNameElement = document.createElement("h2");
      recipeNameElement.classList.add("recipe-name");
      recipeNameElement.id = `${recipeName}-recipe-name`;

      const recipeDescription = document.createElement("div");
      recipeDescription.classList.add("desc-div");
      recipeDescription.id = `${recipeName}-desc-div`;

      let forkRecipe;
      forkPromises.push(
        database.getRecipe(recipeName, profile).then((recipe) => {
          recipeNameElement.textContent = recipeName;
          recipeDescription.innerHTML = recipe.desc;
          forkRecipe = recipe;
          forkRecipe.name = recipeName;
        })
      );

      recipeContainer.appendChild(recipeDiv);
      recipeDiv.appendChild(imgContainer);
      imgContainer.appendChild(recipeImg);
      imgContainer.appendChild(gradientOverlay);
      recipeDiv.appendChild(recipeElements);
      recipeElements.appendChild(topElements);
      topElements.appendChild(recipeNameElement);
      recipeElements.appendChild(recipeDescription);
      //
      if (type === "home") {
        createMenu(database, recipeDiv, recipeName);
      } else if (type === "profile") {
        Promise.all(forkPromises).then(() => {
          createForkBtn(database, recipeDiv, forkRecipe, recipeImg);
        });
      }
    }
  });
}

function createForkBtn(database, recipeDiv, recipe, recipeImg) {
  const forkBtn = document.createElement("div");
  forkBtn.classList.add("fork-btn");
  forkBtn.innerHTML = "fork";
  recipeDiv.appendChild(forkBtn);

  forkBtn.addEventListener("click", () => {
    fetch("../img/food-placeholder-1.jpg").then((response) => {
      response.blob().then((blob) => {
        const fileObject = new File([blob], "image.jpg", {
          type: "image/jpeg",
        });
        database.addRecipe(recipe, fileObject);
      });
    });
    // match /users/{userId}/{allPaths=**} {
    //   allow read, write: if request.auth != null && request.auth.uid == userId  && request.auth.uid == request.path[1];
    // }

    //   const sourceRef = firebase
    //     .storage()
    //     .ref(`${profile}/images/${recipe.name}`);
    //   sourceRef.getDownloadURL().then((sourceUrl) => {
    //     const destRef = firebase
    //       .storage()
    //       .ref(`${database.user}/images/${recipe.name}`);
    //     destRef.getDownloadURL().then((destUrl) => {
    //       copyImage(sourceUrl, destUrl);
    //     });
    //   });
    // });
  });
}
// async function copyImage(sourceUrl, destinationPath) {
//   try {
//     const response = await fetch("/.workflows/workflow-name", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         sourceUrl: sourceUrl,
//         destinationPath: destinationPath,
//       }),
//     });
//     const result = await response.text();
//     console.log(result);
//   } catch (error) {
//     console.error("Error copying image:", error);
//   }
// }

async function handleShoppingToggle(database, recipeName) {
  database.updateShoppingList(recipeName);

  document
    .getElementById(`shop-text-${recipeName}`)
    .classList.toggle("shop-added");
  document
    .getElementById(`shop-icon-${recipeName}`)
    .classList.toggle("shop-added");
}

async function checkRecipeInDbList(database, recipe, svgElement, shoppingText) {
  // returns true if recipe in shopping list in db
  database.recipeInShoppingList(recipe).then((inList) => {
    if (inList) {
      svgElement.classList.add("shop-added");
      shoppingText.classList.add("shop-added");
    }
  });
}

export function generateRecipeModal(
  database,
  recipeName,
  profile = database.user
) {
  database.getRecipe(recipeName, profile).then((recipe) => {
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
    database.getRecipeImage(recipeName, profile).then((url) => {
      image.src = url;
    });

    //Description

    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description-div");

    const descriptionElement = document.createElement("h2");
    descriptionElement.classList.add("modal-description");
    descriptionDiv.appendChild(descriptionElement);

    //Prep Time
    const prepTimeLabel = document.createElement("label");
    prepTimeLabel.classList.add("detail-label");

    //Cook Time
    const cookTimeLabel = document.createElement("label");
    cookTimeLabel.classList.add("detail-label");

    //Servings

    const servingsContainer = document.createElement("div");
    servingsContainer.classList.add("servings-container");

    const servingsLabel = document.createElement("label");
    servingsLabel.classList.add("detail-label");
    servingsLabel.textContent = "Servings:";
    servingsContainer.appendChild(servingsLabel);

    const servingsInput = document.createElement("input");
    servingsInput.classList.add("servings-input");

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

    descriptionElement.textContent = recipe.desc;
    servingsInput.value = `${recipe.servings}`;

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
    fetch("../svgs/x.svg")
      .then((response) => response.text())
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
        const svgElement = svgDOM.querySelector("svg");
        svgElement.classList.add("close-button");
        modalContentElement.appendChild(svgElement);

        svgElement.addEventListener("click", function () {
          closeModal(modalElement);
        });
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });

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
  });
}

export function displayRecipeModal(modalId) {
  const modal = document.getElementById(modalId);
  openModal(modal);
}

export function openModal(modal) {
  modal.style.display = "block";
  document.getElementById("body").classList.add("body-modal-open");
  modal.scrollTop = "0";
}

export function closeModal(modal) {
  modal.style.display = "none";
  document.getElementById("body").classList.remove("body-modal-open");
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

export async function createImageFileObject(image) {
  if (image) {
    try {
      // Fetch the image data
      const response = await fetch(image.src);

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      // Convert response data to a Blob
      const blob = await response.blob();

      // Create a File object from the Blob
      const fileObject = new File([blob], "image.jpg", { type: "image/jpeg" });

      // Log the created File object
      console.log("Created File object:", fileObject);
      return fileObject;
    } catch (error) {
      console.error("Error:", error.message);
      return { error: error.message };
    }
  } else {
    return null;
  }
}
