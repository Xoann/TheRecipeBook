document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addRecipeForm");
  const listContainer = document.getElementById("list-container-steps");
  const addItemButton = document.getElementById("add-step");

  let itemCount = 0;

  addItemButton.addEventListener("click", function () {
    const listItem = document.createElement("div");
    listItem.classList.add("step-item");

    const paragraph = document.createElement("p");
    paragraph.classList.add("resizable-p");
    const stepInput = document.createElement("span");
    stepInput.classList.add("textarea");
    stepInput.setAttribute("role", "textbox");
    stepInput.contentEditable = true;

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-item");
    removeButton.innerText = "-";
    removeButton.classList.add("plus-button");
    removeButton.addEventListener("click", function () {
      listContainer.removeChild(listItem);
    });

    listItem.appendChild(stepInput);
    listItem.appendChild(removeButton);
    listContainer.appendChild(listItem);

    itemCount++;
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

//Submit recipe name, recipe desc, cooktime, preptime to database
// let addRecipeDB = firebase.database().ref("addRecipe");

document.getElementById("addRecipeForm").addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  let recipeName = getElementVal("recipeName");
  let recipeDesc = getElementVal("recipeDesc");
  let cookTime = getElementVal("cookTime");
  let prepTime = getElementVal("prepTime");
  let servings = getElementVal("servings");
  let ingredients = [];
  let steps = [];

  const num_ingredients = document
    .getElementById("list-container-ingredients")
    .getElementsByClassName("list-item").length;
  for (let i = 0; i < num_ingredients; i++) {
    ingredients.push({
      name: getElementVal(`ingredient_${i}`),
      value: getElementVal(`ingredient_value_${i}`),
      unit: getElementVal(`ingredient_unit_${i}`),
    });
  }

  const num_steps = document
    .getElementById("list-container-steps")
    .getElementsByClassName("list-item").length;
  for (let i = 0; i < num_steps; i++) {
    steps.push(getElementVal(`recipe-step_${i}`));
  }

  const recipeImage = document.getElementById("recipeImg");
  const image = recipeImage.files[0];

  writeUserData(
    recipeName,
    recipeDesc,
    cookTime,
    prepTime,
    servings,
    ingredients,
    steps,
    image
  );
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

// const saveMessages = (recipeName, recipeDesc, cookTime, prepTime) => {
//     let newAddRecipe = addRecipeDB.push();

//     const db = firebase.database();
//     newAddRecipe.set(ref(db, 'users/' + userId),{
//         recipeName:recipeName,
//         recipeDesc:recipeDesc,
//         cookTime:cookTime,
//         prepTime:prepTime
//     });
// };

function writeUserData(
  recipeName,
  recipeDesc,
  cookTime,
  prepTime,
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
      cookTime: cookTime,
      prepTime: prepTime,
      servings: servings,
      ingredients: ingredients,
      steps: steps,
    });
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(
    `${firebase.auth().currentUser.uid}/images/${recipeName}`
  );

  imageRef.put(image).then((snapshot) => {
    console.log("Uploaded");
  });
}
