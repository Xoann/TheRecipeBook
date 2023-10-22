export function capitalize(word) {
  if (!word) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function createMenu(recipeDiv) {
  const menu = document.createElement("div");
  menu.classList.add("menu");

  const shoppingDiv = document.createElement("div");
  shoppingDiv.classList.add("slideout-menu-btn");
  const shoppingText = document.createElement("p");
  shoppingText.id = `shopping-btn-text-${recipeNames[i]}`;
  shoppingText.textContent = "Add";
  shoppingText.classList.add("btn-text");

  shoppingText.id = `shop-text-${recipeNames[i]}`;

  shoppingDiv.addEventListener("click", () => {
    handleShoppingToggle(recipeNames[i]);
  });

  fetch("../svgs/shop.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      const svgElement = svgDOM.querySelector("svg");
      svgElement.id = `shop-icon-${recipeNames[i]}`;

      checkRecipeInDbList(recipeNames[i], svgElement, shoppingText);

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
  recipeCardMenuBtn.addEventListener("click", () => {
    handleElipsisBtnPress(recipeNames[i]);
  });

  recipeCardMenu.appendChild(recipeCardMenuBtn);
  recipeCardMenu.appendChild(slideoutMenuMask);
  recipeDiv.appendChild(recipeCardMenu);
}

export function displayRecipes(database, recipeNames, type) {
  // Displays recipes as card in the recipe-container DOM element (class)

  for (let i = 0; i < recipeNames.length; i++) {
    const recipeName = recipeNames[i];

    const recipeContainer =
      document.getElementsByClassName("recipe-container")[0];

    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-div");
    recipeDiv.id = `${recipeNames}-recipe-div`;

    recipeDiv.addEventListener("click", function (event) {
      const goodList = [
        document.getElementById(`${recipeNames}-overlay`),
        document.getElementById(`${recipeNames}-recipe-div`),
        document.getElementById(`${recipeNames}-desc-div`),
        document.getElementById(`${recipeNames}-recipe-name`),
        document.getElementById(`${recipeNames}-recipe-elements`),
        document.getElementById(`${recipeNames}-top-elements`),
      ];
      const isCardClicked = goodList.includes(event.target);
      if (isCardClicked) {
        displayRecipeModal(recipeNames);
      }
    });

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const recipeImg = document.createElement("img");
    recipeImg.classList.add("recipe-img");
    database.getRecipeImage(recipeNames).then((url) => {
      recipeImg.src = url;
    });

    const gradientOverlay = document.createElement("div");
    gradientOverlay.classList.add("gradient-overlay");
    gradientOverlay.id = `${recipeNames}-overlay`;

    const recipeElements = document.createElement("div");
    recipeElements.classList.add("recipe-elements");
    recipeElements.id = `${recipeNames}-recipe-elements`;

    const topElements = document.createElement("div");
    topElements.classList.add("top-elements");
    topElements.id = `${recipeNames}-top-elements`;

    const recipeNameElement = document.createElement("h2");
    recipeNameElement.classList.add("recipe-name");
    recipeNameElement.id = `${recipeNames}-recipe-name`;

    const recipeDescription = document.createElement("div");
    recipeDescription.classList.add("desc-div");
    recipeDescription.id = `${recipeNames}-desc-div`;

    database.getRecipe(recipeName).then((recipe) => {
      recipeNameElement.textContent = recipe.name;
      recipeDescription.innerHTML = recipe.desc;
    });

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
      createMenu(recipeDiv);
    } else if (type === "profile") {
      //
    }
  }
}

export function generateRecipeModal(database, recipeName) {
  database.getRecipe(recipeName).then((recipe) => {
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
    database.getRecipeImage(recipeName).then((url) => {
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

// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// //////////////////////////////////////////////////
// export function displayRecipes(recipeNames, user) {
//   const imageURLs = getImageURLs(recipeNames, user);

//   for (let i = 0; i < recipeNames.length; i++) {
//     generateRecipeModal(recipeNames[i], imageURLs);

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
//     database.getRecipeImage(recipeNames[i]).then((url) => {
//       recipeImg.src = url;
//     });

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

// export async function generateRecipeModal(recipeName, imageURLs) {
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

// // Modal window interactivity

// export function displayRecipeModal(modalId) {
//   const modal = document.getElementById(modalId);
//   openModal(modal);
// }

// export function openModal(modal) {
//   modal.style.display = "block";
//   document.getElementById("body").classList.add("body-modal-open");
//   modal.scrollTop = "0";
// }

// export function closeModal(modal) {
//   modal.style.display = "none";
//   document.getElementById("body").classList.remove("body-modal-open");
// }

// // //////////////////////////////////////////////////
// // //////////////////////////////////////////////////
// // //////////////////////////////////////////////////
// // //////////////////////////////////////////////////
// // //////////////////////////////////////////////////
// // //////////////////////////////////////////////////
