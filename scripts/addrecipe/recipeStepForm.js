document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addRecipeForm");
  const listContainer = document.getElementById("list-container-steps");
  const addItemButton = document.getElementById("add-step");

  let itemCount = 0;

  addItemButton.addEventListener("click", function () {
    const listItem = document.createElement("div");
    listItem.classList.add("step-item");

    const number = document.createElement("label");
    number.classList.add("step-number");
    number.id = `step-number_${itemCount}`;
    number.innerText = `${itemCount + 1}:`;

    const paragraph = document.createElement("p");
    paragraph.classList.add("resizable-p");
    const stepInput = document.createElement("span");

    stepInput.setAttribute("role", "textbox");
    stepInput.contentEditable = true;
    stepInput.classList.add("input-transition");
    stepInput.classList.add("textarea");
    stepInput.classList.add("step-input");

    stepInput.id = `recipe-step_${itemCount}`;

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-item");
    removeButton.innerText = "-";
    removeButton.classList.add("plus-button");
    removeButton.addEventListener("click", function () {
      stepInput.classList.remove("textarea-animation");
      listItem.classList.remove("step-container-animation");
      setTimeout(function () {
        listContainer.removeChild(listItem);
        itemCount--;
      }, 40);

      let labelList = document.getElementsByClassName("step-number");
      let textareaList = document.getElementsByClassName("step-input");
      for (let i = 0; i < itemCount; i++) {
        labelList[i].id = `step-number_${i}`;
        labelList[i].innerText = `${i + 1}:`;
        textareaList[i].id = `recipe-step_${i}`;
      }
    });
    listItem.append(number);
    listItem.appendChild(stepInput);
    listItem.appendChild(removeButton);
    listContainer.appendChild(listItem);

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

document.getElementById("addRecipeForm").addEventListener("submit", submitForm);

// function trySubmitform(){
//   if (){

//   }
// }

function submitForm(e) {
  e.preventDefault();

  let recipeName = getElementVal("recipeName");
  let recipeDesc = getElementVal("recipeDesc");
  let cookTimeHrs = getElementVal("cookTimeHrs");
  let cookTimeMins = getElementVal("cookTimeMins");
  let prepTimeHrs = getElementVal("prepTimeHrs");
  let prepTimeMins = getElementVal("prepTimeMins");
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

  imageRef.put(image).then((snapshot) => {
    console.log("Uploaded");
  });
}
