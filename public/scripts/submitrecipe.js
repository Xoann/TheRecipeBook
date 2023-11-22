import { Database, Recipe, Ingredient } from "./classes.js";
import { compressImage, createImageFileObject } from "./functions.js";

export function checkErrors(
  recipeIdentifier,
  recipeName,
  prepTimeHrs,
  prepTimeMins,
  cookTimeHrs,
  cookTimeMins,
  servings,
  addIngredient,
  addStep
) {
  //Check Form for errors before submitting
  console.log("checking");
  let error = 0;

  //Empty Recipe Name
  if (!recipeName.value) {
    error = 1;
    recipeName.classList.add("input-error");
    recipeName.addEventListener("input", function () {
      checkIfEmpty(recipeName);
    });
  }

  //Empty Prep Time (Only one of mins or hrs needs a value)
  if (!prepTimeMins.value && !prepTimeHrs.value) {
    error = 1;
    prepTimeMins.classList.add("input-error");
    prepTimeHrs.classList.add("input-error");
    prepTimeHrs.addEventListener("input", function () {
      checkIfEmpty(prepTimeHrs);
    });
    prepTimeMins.addEventListener("input", function () {
      checkIfEmpty(prepTimeMins);
    });
  }

  //Empty Cook Time (Only one of mins or hrs needs a value)
  if (!cookTimeMins.value && !cookTimeHrs.value) {
    error = 1;
    cookTimeMins.classList.add("input-error");
    cookTimeHrs.classList.add("input-error");
    cookTimeHrs.addEventListener("input", function () {
      checkIfEmpty(cookTimeHrs);
    });
    cookTimeMins.addEventListener("input", function () {
      checkIfEmpty(cookTimeMins);
    });
  }

  //Empty Servings
  if (servings.value.length === 0) {
    error = 1;
    servings.classList.add("input-error");
    servings.addEventListener("input", function () {
      checkIfEmpty(servings);
    });
  }
  const num_ingredients = document.getElementsByClassName(
    `ingredient-row-container_${recipeIdentifier}`
  ).length;

  const num_steps = document.getElementsByClassName(
    `step-item_${recipeIdentifier}`
  ).length;

  //No Steps
  if (num_steps === 0) {
    error = 1;
    addStep.classList.add("input-error");
    addStep.addEventListener("click", function () {
      if (
        document
          .getElementById("list-container-steps")
          .getElementsByClassName("step-item").length > 0
      ) {
        addStep.classList.remove("input-error");
      }
    });
  }
  //No Ingredients
  if (num_ingredients === 0) {
    error = 1;
    addIngredient.classList.add("input-error");
    addIngredient.addEventListener("click", function () {
      console.log(
        document
          .getElementById("list-container-ingredients")
          .getElementsByClassName("ingredient-row-container").length
      );
      if (
        document
          .getElementById("list-container-ingredients")
          .getElementsByClassName("ingredient-row-container").length > 0
      ) {
        addIngredient.classList.remove("input-error");
      }
    });
  }
  //Ingredients missing values
  for (let i = 0; i < num_ingredients; i++) {
    if (getElementVal(`ingredient_${recipeIdentifier}_${i}`).length === 0) {
      let ingredientNameInput = document.getElementById(
        `ingredient_${recipeIdentifier}_${i}`
      );
      ingredientNameInput.classList.add("input-error");
      ingredientNameInput.addEventListener("input", function () {
        checkIfEmpty(ingredientNameInput);
      });
      error = 1;
    }
  }

  //Make sure all ingredients are fractions or whole numbers or whole number then fraction
  for (let i = 0; i < num_ingredients; i++) {
    let ingValElement = document.getElementById(
      `ingredient_value_${recipeIdentifier}_${i}`
    );
    let ingVal = getElementVal(`ingredient_value_${recipeIdentifier}_${i}`);

    let ingError = true;

    if (!isNaN(isNumber(ingVal))) {
      // if its a number then no errors
      ingError = false;
    } else if (
      ingVal.split(" ").length === 1 && //its its not a number and only one word
      ingVal.split("/").length === 2 && // has exactly one /
      ingVal.split("/")[0].length > 0 && // there are numbers on both sides of the /
      ingVal.split("/")[1].length > 0 &&
      isNumber(ingVal.split("/")[1]) !== 0 //not dividing by 0
    ) {
      ingError = false;
    } else if (
      ingVal.split(" ").length === 2 && // if there are two words
      !isNaN(isNumber(ingVal.split(" ")[0])) && // first part is a number
      ingVal.split(" ")[1].split("/").length === 2 && // second part is a fraction
      ingVal.split(" ")[1].split("/")[0].length > 0 && // there are numbers on both sides of the /
      ingVal.split(" ")[1].split("/")[1].length > 0 &&
      isNumber(ingVal.split(" ")[1].split("/")[1]) !== 0 // not dividing by 0
    ) {
      ingError = false;
    }

    if (ingError) {
      ingValElement.classList.add("input-error");
      ingValElement.addEventListener("input", function () {
        checkIfEmpty(ingValElement);
      });
      error = 1;
    }
  }

  //Empty Steps
  for (let i = 0; i < num_steps; i++) {
    let stepInput = document.getElementById(
      `recipe-step_${recipeIdentifier}_${i}`
    );
    if (!stepInput.textContent) {
      stepInput.classList.add("input-error");
      stepInput.addEventListener("input", function () {
        checkIfSpanEmpty(document.getElementById(`recipe-step_${i}`));
      });
      error = 1;
    }
  }

  console.log("done checks");
  if (error === 0) {
    console.log("no errors");
    return true;
  } else {
    return false;
  }
}

function isNumber(value) {
  let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = 0; i < value.length; i++) {
    if (!numbers.includes(value[i])) {
      return NaN;
    }
  }

  return Number(value);
}

//Remove red border when something is typed in text box
function checkIfEmpty(element) {
  if (element.value) {
    element.classList.remove("input-error");
    if (
      element === document.getElementById("prepTimeMins") ||
      element === document.getElementById("prepTimeHrs")
    ) {
      document.getElementById("prepTimeMins").classList.remove("input-error");
      document.getElementById("prepTimeHrs").classList.remove("input-error");
    }
    if (
      element === document.getElementById("cookTimeMins") ||
      element === document.getElementById("cookTimeHrs")
    ) {
      document.getElementById("cookTimeMins").classList.remove("input-error");
      document.getElementById("cookTimeHrs").classList.remove("input-error");
    }
  }
}

function checkIfSpanEmpty(element) {
  if (element.textContent) {
    element.classList.remove("input-error");
  }
}

function ifEmptyTime(element) {
  if (!element) {
    return "0";
  } else {
    return element;
  }
}

//Submit data after checks
export function submitForm(
  database,
  e,
  recipeIdentifier,
  imagesArray,
  recipeName,
  recipeDesc,
  prepTimeHrs,
  prepTimeMins,
  cookTimeHrs,
  cookTimeMins,
  servings
) {
  e.preventDefault();

  let recipeNameVal = recipeName.value;
  let recipeDescVal = recipeDesc.textContent;
  let cookTimeHrsVal = ifEmptyTime(cookTimeHrs.value);
  let cookTimeMinsVal = ifEmptyTime(cookTimeMins.value);
  let prepTimeHrsVal = ifEmptyTime(prepTimeHrs.value);
  let prepTimeMinsVal = ifEmptyTime(prepTimeMins.value);
  let servingsVal = servings.value;

  let ingredients = [];
  let steps = [];
  const num_ingredients = document.getElementsByClassName(
    `ingredient-row-container_${recipeIdentifier}`
  ).length;
  console.log(num_ingredients);
  for (let i = 0; i < num_ingredients; i++) {
    ingredients.push(
      new Ingredient(
        getElementVal(`ingredient_${recipeIdentifier}_${i}`),
        getElementVal(`ingredient_value_${recipeIdentifier}_${i}`),
        getElementVal(`ingredient_unit_${recipeIdentifier}_${i}`)
      )
    );
  }

  const num_steps = document.getElementsByClassName(
    `step-item_${recipeIdentifier}`
  ).length;
  for (let i = 0; i < num_steps; i++) {
    steps.push(
      document.getElementById(`recipe-step_${recipeIdentifier}_${i}`)
        .textContent
    );
  }

  const recipe = new Recipe(
    recipeNameVal,
    recipeDescVal,
    cookTimeHrsVal,
    cookTimeMinsVal,
    prepTimeHrsVal,
    prepTimeMinsVal,
    servingsVal,
    ingredients,
    steps
  );

  //const image = imagesArray[0];
  const image = document.getElementsByClassName(
    `recipeImg_${recipeIdentifier}`
  )[0];
  //console.log(image.src);
  console.log(imagesArray[0]);

  return createImageFileObject(image).then((result) => {
    if (image) {
      return compressImage(result, 800, 800).then((compressedImage) => {
        return database.addRecipe(recipe, compressedImage);
      });
    } else {
      return database.addRecipe(recipe, image);
    }
  });
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};
