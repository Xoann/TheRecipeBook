import { addIngredient } from "../addingredientbutton.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addRecipeForm");
  const listContainer = document.getElementById("list-container-ingredients");
  const addItemButton = document.getElementById("add-ingredient");
  let ingredientContainer = "ingredient-row-container-add";

  addIngredient(listContainer, ingredientContainer);

  addItemButton.addEventListener("click", function () {
    addIngredient(listContainer, ingredientContainer);
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

function limitInputLength(element, maxLength) {
  let inputValue = element.value.toString();

  if (inputValue.length > maxLength) {
    element.value = inputValue.slice(0, maxLength);
  }
}

function displayImage() {
  console.log("displaying");
  var fileInput = document.getElementById("recipeImg");
  var imageContainer = document.getElementById("display-image");

  // Check if a file is selected
  if (fileInput.files.length > 0) {
    var selectedFile = fileInput.files[0];
    var reader = new FileReader();

    // Read the content of the file as a data URL
    reader.onload = function (e) {
      // Display the image on the page
      var imageElement = document.createElement("img");
      imageElement.src = e.target.result;
      imageElement.alt = "Selected Image";
      imageElement.id = "image";

      // Clear previous content and append the image
      imageContainer.innerHTML = "";
      imageContainer.appendChild(imageElement);
    };

    // Read the file as a data URL
    reader.readAsDataURL(selectedFile);

    document.getElementsByClassName("close")[0].style.display = "block";
  }
}

const closeButton = document.getElementsByClassName("close")[0];
closeButton.addEventListener("click", function () {
  this.style.display = "none";
  document
    .getElementById("display-image")
    .removeChild(document.getElementById("image"));
});

function restrictInput(event, element, maxLength) {
  var allowedCharacters = /^[0-9\/]*$/; // Regex for numbers and /
  var inputField = event.target;
  //var errorMessage = document.getElementById("error-message");

  // Check if the entered character is allowed
  if (!allowedCharacters.test(inputField.value)) {
    // Prevent the character from being entered
    inputField.value = inputField.value.slice(0, -1);

    //errorMessage.textContent = "Please enter only numbers and /.";
  }
  limitInputLength(element, maxLength);
}
