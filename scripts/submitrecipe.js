export function checkErrors(
  e,
  recipeIdentifier,
  imagesArray,
  recipeName,
  recipeDesc,
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
    if (getElementVal(`ingredient_${i}`).length === 0) {
      document.getElementById(`ingredient_${i}`).classList.add("input-error");
      document
        .getElementById(`ingredient_${i}`)
        .addEventListener("input", function () {
          checkIfEmpty(document.getElementById(`ingredient_${i}`));
        });
      error = 1;
    }
  }

  //Empty Steps
  for (let i = 0; i < num_steps; i++) {
    if (!document.getElementById(`recipe-step_${i}`).textContent) {
      document.getElementById(`recipe-step_${i}`).classList.add("input-error");
      document
        .getElementById(`recipe-step_${i}`)
        .addEventListener("input", function () {
          checkIfSpanEmpty(document.getElementById(`recipe-step_${i}`));
        });
      error = 1;
    }
  }

  console.log("done checks");
  if (error === 0) {
    console.log("no errors");
    submitForm(
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
    );
  }
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
function submitForm(
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
    ingredients.push({
      name: getElementVal(`ingredient_${i}`),
      value: getElementVal(`ingredient_value_${i}`),
      unit: getElementVal(`ingredient_unit_${i}`),
    });
  }

  const num_steps = document.getElementsByClassName(
    `step-item_${recipeIdentifier}`
  ).length;
  for (let i = 0; i < num_steps; i++) {
    steps.push(document.getElementById(`recipe-step_${i}`).textContent);
  }

  //const image = imagesArray[0];
  const image = document.getElementsByClassName(
    `recipeImg_${recipeIdentifier}`
  )[0];
  console.log(`recipeImg_${recipeIdentifier}`);
  console.log(image.src);
  console.log(imagesArray[0]);

  let imageFile;
  fetch(image.src)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a File object from the Blob
      imageFile = new File([blob], `${recipeNameVal}.png`, {
        type: "image/png",
      });

      // Log the created File object
      console.log(imageFile);
    })
    .catch((error) => console.error("Error fetching image:", error));

  writeUserData(
    recipeNameVal,
    recipeDescVal,
    cookTimeHrsVal,
    cookTimeMinsVal,
    prepTimeHrsVal,
    prepTimeMinsVal,
    servingsVal,
    ingredients,
    steps,
    //imageFile
    imagesArray[0]
  );
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

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
  console.log(image);
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