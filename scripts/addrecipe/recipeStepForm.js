document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addRecipeForm");
  const listContainer = document.getElementById("list-container-steps");
  const addItemButton = document.getElementById("add-step");

  let itemCount = 0;

  //Add Step Row when Plus button is clicked
  addItemButton.addEventListener("click", function () {
    const listItem = document.createElement("div");
    listItem.classList.add("step-item");

    //Create number label
    const number = document.createElement("label");
    number.classList.add("step-number");
    number.id = `step-number_${itemCount}`;
    number.innerText = `${itemCount + 1}:`;

    //Create textarea
    const paragraph = document.createElement("p");
    paragraph.classList.add("resizable-p");
    const stepInput = document.createElement("span");

    stepInput.setAttribute("role", "textbox");
    stepInput.contentEditable = true;
    stepInput.classList.add("input-transition");
    stepInput.classList.add("details-input");
    stepInput.classList.add("textarea");
    stepInput.classList.add("step-input");

    stepInput.id = `recipe-step_${itemCount}`;

    //Create Minus button
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-item");
    removeButton.innerText = "-";
    removeButton.classList.add("plus-button");

    //When minus button clicked:
    removeButton.addEventListener("click", function () {
      //remove animation
      stepInput.classList.remove("textarea-animation");
      listItem.classList.remove("step-container-animation");
      setTimeout(function () {
        listContainer.removeChild(listItem);
        itemCount--;
        //Reassign indexes for label and ids
        let labelList = document.getElementsByClassName("step-number");
        let textareaList = document.getElementsByClassName("step-input");

        for (let i = 0; i < itemCount; i++) {
          labelList[i].id = `step-number_${i}`;
          labelList[i].innerText = `${i + 1}:`;
          textareaList[i].id = `recipe-step_${i}`;
        }
      }, 40);
    });
    listItem.append(number);
    listItem.appendChild(stepInput);
    listItem.appendChild(removeButton);
    listContainer.appendChild(listItem);

    //New Step animation
    setTimeout(function () {
      stepInput.classList.add("textarea-animation");
      listItem.classList.add("step-container-animation");
    }, 10);

    itemCount++;
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

//Submit recipe name, recipe desc, cooktime, preptime to database
// let addRecipeDB = firebase.database().ref("addRecipe");

document.getElementById("submit").addEventListener("click", function (e) {
  //Check Form for errors before submitting
  console.log("try");
  let recipeName = document.getElementById("recipeName");
  let prepTimeHrs = document.getElementById("prepTimeHrs");
  let prepTimeMins = document.getElementById("prepTimeMins");
  let cookTimeHrs = document.getElementById("cookTimeHrs");
  let cookTimeMins = document.getElementById("cookTimeMins");
  let servings = document.getElementById("servings");
  let addIngredient = document.getElementById("add-ingredient");
  let addStep = document.getElementById("add-step");

  //Get ingredient and step containers, used in submitForm
  let ingredients = [];
  let steps = [];
  const num_ingredients = document
    .getElementById("list-container-ingredients")
    .getElementsByClassName("ingredient-row-container").length;
  for (let i = 0; i < num_ingredients; i++) {
    ingredients.push({
      name: getElementVal(`ingredient_${i}`),
      value: getElementVal(`ingredient_value_${i}`),
      unit: getElementVal(`ingredient_unit_${i}`),
    });
  }

  const num_steps = document
    .getElementById("list-container-steps")
    .getElementsByClassName("step-item").length;
  for (let i = 0; i < num_steps; i++) {
    steps.push(getElementVal(`recipe-step_${i}`));
  }

  //Empty Recipe Name
  let error = 0;
  if (!recipeName.value) {
    console.log(recipeName.value);
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
    // if (getElementVal(`ingredient_value_${i}`).length === 0) {
    //   document
    //     .getElementById(`ingredient_value_${i}`)
    //     .classList.add("input-error");
    //   document
    //     .getElementById(`ingredient_value_${i}`)
    //     .addEventListener("input", function () {
    //       checkIfEmpty(document.getElementById(`ingredient_value_${i}`));
    //     });
    // }
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

  if (error === 0) {
    submitForm(e);
  }
});

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
function submitForm(e) {
  e.preventDefault();

  let recipeName = getElementVal("recipeName");
  let recipeDesc = document.getElementById("description").textContent;
  let cookTimeHrs = ifEmptyTime(getElementVal("cookTimeHrs"));
  let cookTimeMins = ifEmptyTime(getElementVal("cookTimeMins"));
  let prepTimeHrs = ifEmptyTime(getElementVal("prepTimeHrs"));
  let prepTimeMins = ifEmptyTime(getElementVal("prepTimeMins"));
  let servings = getElementVal("servings");

  let ingredients = [];
  let steps = [];
  const num_ingredients = document
    .getElementById("list-container-ingredients")
    .getElementsByClassName("ingredient-row-container").length;
  for (let i = 0; i < num_ingredients; i++) {
    ingredients.push({
      name: getElementVal(`ingredient_${i}`),
      value: getElementVal(`ingredient_value_${i}`),
      unit: getElementVal(`ingredient_unit_${i}`),
    });
  }

  const num_steps = document
    .getElementById("list-container-steps")
    .getElementsByClassName("step-item").length;
  for (let i = 0; i < num_steps; i++) {
    steps.push(document.getElementById(`recipe-step_${i}`).textContent);
  }

  const recipeImage = document.getElementById("recipeImg");
  const image = recipeImage.files[0];

  writeUserData(
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
  increaseRecipeCount(firebase.auth().currentUser.uid);
}

//Sign out / Sign in button

firebase.auth().onAuthStateChanged((user) => {
  const signOutButton = document.getElementById("sign-out");
  signOutButton.addEventListener("click", function () {
    if (user) {
      firebase.auth().signOut();
    } else {
      window.location.href = "login.html";
    }
  });
  if (user) {
    document.getElementById("sign-out").innerText = "Sign Out";
  } else {
    console.log("uid not found");
    document.getElementById("sign-out").innerText = "Sign In";
  }
});

function increaseRecipeCount(user) {
  console.log("hi");
  const docRef = firebase.firestore().collection("users").doc(user);
  docRef.get().then((doc) => {
    const recipeCount = doc.data().recipes;
    docRef.update({
      recipes: recipeCount + 1,
    });
  });
}
