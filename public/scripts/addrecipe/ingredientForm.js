import { addIngredient } from "../addingredientbutton.js";
import { displayImage } from "../addimage.js";
import { deleteImage } from "../addimage.js";
import { handleFileChange } from "../addimage.js";
import { checkErrors, submitForm } from "../submitrecipe.js";
import { addStep } from "../addstepbutton.js";
import { Database } from "../classes.js";
import { compressImage } from "../functions.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addRecipeForm");
  const ingredientContainer = document.getElementById(
    "list-container-ingredients"
  );
  const addIngredientButton = document.getElementById("add-ingredient");
  let ingredientIdentifier = "add";

  addIngredient(ingredientContainer, ingredientIdentifier);

  addIngredientButton.addEventListener("click", function () {
    addIngredient(ingredientContainer, ingredientIdentifier);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  const stepContainer = document.getElementById("list-container-steps");
  const addStepButton = document.getElementById("add-step");

  let stepIdentifier = "add";

  addStep(stepContainer, stepIdentifier);

  //Add Step Row when Plus button is clicked
  addStepButton.addEventListener("click", function () {
    addStep(stepContainer, stepIdentifier);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

window.addEventListener("click", function (event) {
  let datalistList = document.getElementsByClassName("data-list");
  let unitInputList = document.getElementsByClassName("unit-input");

  for (let i = 0; i < datalistList.length; i++) {
    if (
      datalistList[i].style.display === "block" &&
      event.target !== datalistList[i] &&
      event.target !== unitInputList[i]
    ) {
      datalistList[i].style.display = "none";
    }
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

document.getElementById("done-button").addEventListener("click", function () {
  window.location.href = "../../index.html";
});

let input = document.getElementById("recipeImg");
let imagesArray = [];
let imageContainer = document.getElementsByClassName("image-container")[0];
let imageForm = document.getElementById("image-form");
let imageIdentifier = "add";

input.addEventListener("change", () => {
  handleFileChange(
    input,
    imagesArray,
    imageContainer,
    imageForm,
    imageIdentifier
  );
});

document.getElementById("submit").addEventListener("click", function (e) {
  const database = new Database(firebase.auth().currentUser.uid);
  let recipeIdentifier = "add";
  let recipeName = document.getElementById("recipeName");
  let recipeDesc = document.getElementById("description");
  let prepTimeHrs = document.getElementById("prepTimeHrs");
  let prepTimeMins = document.getElementById("prepTimeMins");
  let cookTimeHrs = document.getElementById("cookTimeHrs");
  let cookTimeMins = document.getElementById("cookTimeMins");
  let servings = document.getElementById("servings");
  let addIngredient = document.getElementById("add-ingredient");
  let addStep = document.getElementById("add-step");

  if (
    checkErrors(
      recipeIdentifier,
      recipeName,
      prepTimeHrs,
      prepTimeMins,
      cookTimeHrs,
      cookTimeMins,
      servings,
      addIngredient,
      addStep
    )
  ) {
    document.getElementById("loading-modal").classList.add("show-done-button");
    submitForm(
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
    ).then(() => {
      document
        .getElementById("loading-modal")
        .classList.remove("show-done-button");
      document.getElementById("upload-modal").classList.add("show-done-button");
    });
  }
});

document.getElementById("signin-button").addEventListener("click", function () {
  window.location.href = "../../login.html";
});

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
    document.getElementById("signin-modal").style.display = "none";
  } else {
    console.log("uid not found");
    document.getElementById("sign-out").innerText = "Sign In";
    document.getElementById("signin-modal").style.display = "flex";
  }
});

function limitInputLength(element, maxLength) {
  let inputValue = element.value.toString();

  if (inputValue.length > maxLength) {
    element.value = inputValue.slice(0, maxLength);
  }
}

function restrictInput(element, maxLength) {
  element.value = element.value.replace(/[^0-9]/g, "");

  limitInputLength(element, maxLength);
}
