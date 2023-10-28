import { checkErrors, submitForm } from "./submitrecipe.js";
import {
  closeModal,
  openModal,
  displayRecipes,
  createImageFileObject,
} from "./functions.js";
import { addIngredient } from "./addingredientbutton.js";
import { addStep } from "./addstepbutton.js";
import { handleFileChange, displayImage } from "./addimage.js";

export function generateEditModal(database, recipeName) {
  let changes = 0;
  const recipeIdentifier = recipeName.replace(/ /g, "-");

  const modalElement = document.createElement("div");
  modalElement.classList.add("modal");
  modalElement.id = `${recipeName}-edit`;

  document.getElementById("body").appendChild(modalElement);

  const modalContentElement = document.createElement("div");
  modalContentElement.classList.add("modal-content");
  modalElement.appendChild(modalContentElement);

  //edit title
  const editTitleContainer = document.createElement("div");
  editTitleContainer.classList.add("edit-title-div");
  modalContentElement.appendChild(editTitleContainer);

  const justifyLeft = document.createElement("div");
  justifyLeft.classList.add("justify-left");
  editTitleContainer.appendChild(justifyLeft);

  const editNameTitle = document.createElement("h2");
  editNameTitle.classList.add("edit-name-title");

  editNameTitle.textContent = "Recipe Name";

  justifyLeft.appendChild(editNameTitle);

  const editNameInput = document.createElement("input");
  editNameInput.classList.add("edit-input");
  editNameInput.classList.add("input-transition");
  editNameInput.id = `edit-title_${recipeIdentifier}`;

  editTitleContainer.appendChild(editNameInput);

  //edit image
  const editImageForm = document.createElement("form");
  editImageForm.id = `image-form_${recipeIdentifier}`;

  modalContentElement.appendChild(editImageForm);

  const editImageInputContainer = document.createElement("div");
  editImageInputContainer.classList.add("inputbox");

  editImageForm.appendChild(editImageInputContainer);

  const editImageInput = document.createElement("input");
  editImageInput.type = "file";
  editImageInput.accept = "image/*";
  //editImageInput.onchange = "displayImage()";
  editImageInput.classList.add("image-input");
  editImageInput.id = `edit-image-input_${recipeIdentifier}`;

  editImageInputContainer.appendChild(editImageInput);

  const editImageLabel = document.createElement("label");
  editImageLabel.setAttribute("for", `edit-image-input_${recipeIdentifier}`);
  editImageLabel.classList.add("custom-file-input");
  editImageLabel.textContent = "Edit Image";

  editImageInputContainer.appendChild(editImageLabel);

  const editImageContainer = document.createElement("div");
  editImageContainer.classList.add("image-container");
  editImageContainer.id = `edit-image-container_${recipeName.replace(
    / /g,
    "-"
  )}`;

  modalContentElement.appendChild(editImageContainer);

  //   let input = document.getElementById("recipeImg");
  let imagesArray = [];
  let imageIdentifier = recipeIdentifier;
  //    let imageForm = document.getElementsByClassName("image-container")[0];

  editImageInput.addEventListener("change", () => {
    imagesArray = [];
    console.log(imageIdentifier);
    handleFileChange(
      editImageInput,
      imagesArray,
      editImageContainer,
      editImageForm,
      imageIdentifier
    );
  });

  // const editDisplayImage = document.createElement("div");
  // editDisplayImage.id = `display-image_${recipeIdentifier}`;

  // editImageContainer.appendChild(editDisplayImage);

  //edit description
  const editDescriptionContainer = document.createElement("div");
  editDescriptionContainer.classList.add("description-container");
  modalContentElement.appendChild(editDescriptionContainer);

  const editDescriptionTitle = document.createElement("h2");
  editDescriptionTitle.classList.add("edit-name-title");
  editDescriptionTitle.textContent = "Description";

  editDescriptionContainer.appendChild(editDescriptionTitle);

  const editDescriptionInput = document.createElement("span");
  editDescriptionInput.classList.add("textarea");
  editDescriptionInput.classList.add("edit-description-input");
  editDescriptionInput.classList.add("edit-input");
  editDescriptionInput.classList.add("input-transition");
  editDescriptionInput.role = "textbox";
  editDescriptionInput.contentEditable = true;
  editDescriptionInput.id = `edit-description-input_${recipeName.replace(
    / /g,
    "-"
  )}`;

  editDescriptionContainer.appendChild(editDescriptionInput);

  //edit prep time
  const editDetailsContainer = document.createElement("div");
  editDetailsContainer.classList.add("edit-details-container");
  modalContentElement.appendChild(editDetailsContainer);

  const editPrepTimeContainer = document.createElement("div");
  editPrepTimeContainer.classList.add("edit-small-input-div");
  editDetailsContainer.appendChild(editPrepTimeContainer);

  const editPrepTimeTitle = document.createElement("h2");
  editPrepTimeTitle.classList.add("edit-name-title");
  editPrepTimeTitle.textContent = "Prep Time: ";

  editPrepTimeContainer.appendChild(editPrepTimeTitle);

  const editPrepTimeHrsInput = document.createElement("input");
  editPrepTimeHrsInput.classList.add("edit-input");
  editPrepTimeHrsInput.classList.add("input-transition");
  editPrepTimeHrsInput.classList.add("discard-input");
  editPrepTimeHrsInput.type = "number";
  editPrepTimeHrsInput.addEventListener("input", function () {
    limitInputLength(this, 4);
  });
  editPrepTimeHrsInput.id = `edit-preptime-hrs-input_${recipeName.replace(
    / /g,
    "-"
  )}`;

  editPrepTimeContainer.appendChild(editPrepTimeHrsInput);

  const editPrepTimeMinsInput = document.createElement("input");
  editPrepTimeMinsInput.classList.add("edit-input");
  editPrepTimeMinsInput.classList.add("input-transition");
  editPrepTimeMinsInput.classList.add("discard-input");
  editPrepTimeMinsInput.addEventListener("input", function () {
    limitInputLength(this, 2);
  });
  editPrepTimeMinsInput.id = `edit-preptime-mins-input_${recipeName.replace(
    / /g,
    "-"
  )}`;

  editPrepTimeContainer.appendChild(editPrepTimeMinsInput);

  //edit cook time
  const editCookTimeContainer = document.createElement("div");
  editCookTimeContainer.classList.add("edit-small-input-div");
  editDetailsContainer.appendChild(editCookTimeContainer);

  const editCookTimeTitle = document.createElement("h2");
  editCookTimeTitle.classList.add("edit-name-title");
  editCookTimeTitle.textContent = "Cook Time:";

  editCookTimeContainer.appendChild(editCookTimeTitle);

  const editCookTimeHrsInput = document.createElement("input");
  editCookTimeHrsInput.classList.add("edit-input");
  editCookTimeHrsInput.classList.add("input-transition");
  editCookTimeHrsInput.addEventListener("input", function () {
    limitInputLength(this, 4);
  });
  editCookTimeHrsInput.id = `edit-cooktime-hrs-input_${recipeName.replace(
    / /g,
    "-"
  )}`;

  editCookTimeContainer.appendChild(editCookTimeHrsInput);

  const editCookTimeMinsInput = document.createElement("input");
  editCookTimeMinsInput.classList.add("edit-input");
  editCookTimeMinsInput.classList.add("input-transition");
  editCookTimeMinsInput.addEventListener("input", function () {
    limitInputLength(this, 2);
  });
  editCookTimeMinsInput.id = `edit-cooktime-mins-input_${recipeName.replace(
    / /g,
    "-"
  )}`;

  editCookTimeContainer.appendChild(editCookTimeMinsInput);

  //edit servings
  const editServingsContainer = document.createElement("div");
  editServingsContainer.classList.add("edit-small-input-div");
  editDetailsContainer.appendChild(editServingsContainer);

  const editServingsTitle = document.createElement("h2");
  editServingsTitle.classList.add("edit-name-title");
  editServingsTitle.textContent = "Servings:";

  editServingsContainer.appendChild(editServingsTitle);

  const editServingsInput = document.createElement("input");
  editServingsInput.classList.add("edit-input");
  editServingsInput.classList.add("input-transition");
  editServingsInput.addEventListener("input", function () {
    limitInputLength(this, 4);
  });
  editServingsInput.id = `edit-servings-input_${recipeIdentifier}`;

  editServingsContainer.appendChild(editServingsInput);

  //ingredients and steps div
  const editIngredientsStepsContainer = document.createElement("div");
  editIngredientsStepsContainer.classList.add("edit-ingredients-steps-div");
  modalContentElement.appendChild(editIngredientsStepsContainer);

  //edit ingredients
  const editIngredientsContainer = document.createElement("div");
  editIngredientsContainer.classList.add("edit-ingredients-container");

  const editIngredientsRowContainer = document.createElement("div");
  editIngredientsRowContainer.classList.add("edit-ingredients-row-container");
  editIngredientsRowContainer.id = `edit-ingredients-row-container_${recipeName.replace(
    / /g,
    "-"
  )}`;

  editIngredientsStepsContainer.appendChild(editIngredientsContainer);

  const editIngredientsTitle = document.createElement("h2");
  editIngredientsTitle.classList.add("edit-name-title");
  editIngredientsTitle.textContent = "Ingredients:";

  editIngredientsContainer.appendChild(editIngredientsTitle);
  editIngredientsContainer.appendChild(editIngredientsRowContainer);

  let addIngredientButton;
  fetch("../svgs/plus.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      addIngredientButton = svgDOM.querySelector("svg");
      addIngredientButton.classList.add("edit-plus-button");
      editIngredientsContainer.appendChild(addIngredientButton);

      addIngredientButton.addEventListener("click", function () {
        addIngredient(editIngredientsRowContainer, recipeIdentifier);
      });
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
    });

  //edit steps
  const editStepsContainer = document.createElement("div");
  editStepsContainer.classList.add("edit-steps-container");

  const editStepsRowContainer = document.createElement("div");
  editStepsRowContainer.classList.add("edit-steps-row-container");
  editStepsRowContainer.id = `edit-steps-container_${recipeName.replace(
    / /g,
    "-"
  )}`;

  editIngredientsStepsContainer.appendChild(editStepsContainer);

  const editStepsTitle = document.createElement("h2");
  editStepsTitle.classList.add("edit-name-title");
  editStepsTitle.textContent = "Steps: ";

  editStepsContainer.appendChild(editStepsTitle);
  editStepsContainer.appendChild(editStepsRowContainer);

  let addStepButton;
  fetch("../svgs/plus.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      addStepButton = svgDOM.querySelector("svg");
      addStepButton.classList.add("edit-plus-button");
      editStepsContainer.appendChild(addStepButton);

      addStepButton.addEventListener("click", function () {
        addStep(editStepsRowContainer, recipeIdentifier);
      });
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
    });

  //save
  const editSubmitButton = document.createElement("button");
  editSubmitButton.classList.add("submit-button");
  editSubmitButton.innerHTML = "Save";

  editSubmitButton.addEventListener("click", function (e) {
    if (
      checkErrors(
        recipeIdentifier,
        editNameInput,
        editPrepTimeHrsInput,
        editPrepTimeMinsInput,
        editCookTimeHrsInput,
        editCookTimeMinsInput,
        editServingsInput,
        addIngredientButton,
        addStepButton
      )
    ) {
      // database.deleteRecipe(recipeName);
      submitForm(
        database,
        e,
        recipeIdentifier,
        imagesArray,
        editNameInput,
        editDescriptionInput,
        editPrepTimeHrsInput,
        editPrepTimeMinsInput,
        editCookTimeHrsInput,
        editCookTimeMinsInput,
        editServingsInput
      );
      console.log("Recipe Edited");
      closeModal(modalElement);
      displayRecipes(database, "home");
    }
  });

  modalContentElement.appendChild(editSubmitButton);

  //close button
  fetch("../svgs/x.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      const svgElement = svgDOM.querySelector("svg");
      svgElement.classList.add("close-button");
      modalContentElement.appendChild(svgElement);

      svgElement.addEventListener("click", function () {
        handleDiscard(modalElement, changes);
      });
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
    });

  //discard button
  const discardModal = document.createElement("div");
  discardModal.classList.add("modal");
  discardModal.id = `discard-modal-${recipeIdentifier}`;
  discardModal.innerHTML = `
    <div class="modal-content" id="discard-modal-content">
      <p class="discard-modal-text" id="discard-modal-text"></p>
      <div id="discard-button" class="discard-button">Discard</div>
      <div id="cancel-button" class="cancel-button">Cancel</div>
      <svg id="close-delete-modal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 close">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  `;
  document.body.appendChild(discardModal);

  const modalContent = discardModal.querySelector(".modal-content");

  const discardButton = modalContent.querySelector("#discard-button");
  discardButton.addEventListener("click", function () {
    closeModal(modalElement);
  });

  const cancelButton = modalContent.querySelector("#cancel-button");
  cancelButton.addEventListener("click", function () {
    closeModal(discardModal);
  });

  for (let input of document.getElementsByClassName("discard-input")) {
    input.addEventListener("input", function () {
      changes = 1;
    });
  }
}

function handleDiscard(modalElement, changes) {
  if (changes === 1) {
    openModal(document.querySelector("discard-modal"));
  } else {
    closeModal(modalElement);
  }
}

export function fillEditInputs(database, recipeName) {
  database.getRecipe(recipeName).then((recipe) => {
    let recipeIdentifier = recipeName.replace(/ /g, "-");

    //fill title
    document.getElementById(`edit-title_${recipeIdentifier}`).value =
      recipeName;

    //fill image
    document.getElementById(
      `edit-image-container_${recipeIdentifier}`
    ).innerHTML = "";

    let imagesArray = [];
    const image = document.createElement("img");
    image.classList.add("image");
    image.classList.add(`recipeImg_${recipeIdentifier}`);
    database.getRecipeImage(recipeName).then((url) => {
      createImageFileObject(url, "src").then((imageFile) => {
        let imageContainer = document.getElementById(
          `edit-image-container_${recipeIdentifier}`
        );
        let imageForm = document.getElementById(
          `image-form_${recipeIdentifier}`
        );
        console.log(imageFile);
        imagesArray.push(imageFile);
        displayImage(imageContainer, imagesArray, imageForm, recipeIdentifier);
      });
    });

    // let imgDiv = document.getElementById(
    //   `edit-image-container_${recipeIdentifier}`
    // );

    // document
    //   .getElementById(`edit-image-container_${recipeIdentifier}`)
    //   .appendChild(image);

    //fill description
    document.getElementById(
      `edit-description-input_${recipeIdentifier}`
    ).innerHTML = recipe.desc;

    //fill prep time
    document.getElementById(
      `edit-preptime-hrs-input_${recipeIdentifier}`
    ).value = recipe.prepTimeHrs;
    document.getElementById(
      `edit-preptime-mins-input_${recipeIdentifier}`
    ).value = recipe.prepTimeMins;

    //fill cook time
    document.getElementById(
      `edit-cooktime-hrs-input_${recipeIdentifier}`
    ).value = recipe.cookTimeHrs;
    document.getElementById(
      `edit-cooktime-mins-input_${recipeIdentifier}`
    ).value = recipe.cookTimeMins;

    //fill servings
    document.getElementById(`edit-servings-input_${recipeIdentifier}`).value =
      recipe.servings;

    //fill ingredients
    let ingredientIdentifier = `${recipeIdentifier}`;
    let editIngredientsRowContainer = document.getElementById(
      `edit-ingredients-row-container_${recipeIdentifier}`
    );

    editIngredientsRowContainer.innerHTML = "";

    for (let j = 0; j < recipe.ingredients.length; j++) {
      addIngredient(editIngredientsRowContainer, ingredientIdentifier);
    }

    let ingredientNames = document.getElementsByClassName(
      `ingredient-name_${recipeIdentifier}`
    );
    let ingredientAmounts = document.getElementsByClassName(
      `ingredient-amount_${recipeIdentifier}`
    );
    let ingredientUnits = document.getElementsByClassName(
      `ingredient-unit_${recipeIdentifier}`
    );
    let itemCount = document.getElementsByClassName(
      `ingredient-row-container_${recipeIdentifier}`
    ).length;

    for (let i = 0; i < itemCount; i++) {
      ingredientNames[i].value = recipe.ingredients[i].name;
    }
    for (let i = 0; i < itemCount; i++) {
      ingredientAmounts[i].value = recipe.ingredients[i].value;
    }
    for (let i = 0; i < itemCount; i++) {
      ingredientUnits[i].value = recipe.ingredients[i].unit;
    }

    //fill steps
    let stepIdentifier = `${recipeIdentifier}`;
    let editStepsRowContainer = document.getElementById(
      `edit-steps-container_${recipeIdentifier}`
    );

    editStepsRowContainer.innerHTML = "";

    let stepsList = recipe.steps;

    for (let i = 0; i < stepsList.length; i++) {
      addStep(editStepsRowContainer, stepIdentifier);
    }

    let stepInputs = document.getElementsByClassName(
      `step-input_${stepIdentifier}`
    );
    for (let i = 0; i < stepsList.length; i++) {
      stepInputs[i].innerHTML = stepsList[i];
    }
  });
}
