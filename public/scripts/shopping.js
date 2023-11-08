import { Database } from "./classes.js";

// Load shopping list and recipes
firebase.auth().onAuthStateChanged((user) => {
  const database = new Database(firebase.auth().currentUser.uid);
  getShoppingListData(database).then((data) => {
    generateDOMContent(database, data[0], data[1]);
  });
});

function getShoppingListData(database) {
  return database.getShoppingList().then((shoppingList) => {
    return database.getShoppingListIngredients().then((ingredients) => {
      return [ingredients, shoppingList];
    });
  });
}

function generateDOMContent(database, ingredients, recipes) {
  const ingredientContainer = document.querySelector(".ingredient-container");
  const recipeContainer = document.querySelector(".recipe-container");

  // Display Ingredients
  for (const ingredient of ingredients) {
    const shoppingListEntry = document.createElement("li");
    shoppingListEntry.classList.add("shopping-list-entry");
    if (ingredient.unit) {
      shoppingListEntry.textContent = `${ingredient.value} ${ingredient.unit} of ${ingredient.name}`;
    } else {
      shoppingListEntry.textContent = `${ingredient.value} ${ingredient.name}`;
    }

    ingredientContainer.appendChild(shoppingListEntry);
  }

  // Display Recipes
  for (const recipe of recipes) {
    // console.log(recipes[recipeName]);
    const recipeEntry = document.createElement("div");
    recipeEntry.classList.add("recipe-entry-container");
    recipeContainer.appendChild(recipeEntry);

    const recipeListImageContainer = document.createElement("div");
    recipeListImageContainer.classList.add("shopping-list-entry-div");
    recipeEntry.appendChild(recipeListImageContainer);

    const recipeTitleDiv = document.createElement("div");
    recipeTitleDiv.classList.add("recipe-title-div");
    recipeListImageContainer.appendChild(recipeTitleDiv);

    const recipeListEntryText = document.createElement("h3");
    recipeListEntryText.classList.add("recipe-list-entry-text");

    recipeTitleDiv.appendChild(recipeListEntryText);

    fetch("../svgs/minus.svg")
      .then((response) => response.text())
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
        const removeButton = svgDOM.querySelector("svg");
        recipeEntry.appendChild(removeButton);
        removeButton.classList.add("remove-button");
        removeButton.addEventListener("click", () => {
          database.updateShoppingList(recipe).then(() => {
            window.location.href = "../shoppinglist.html";
          });
        });
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });

    let noimg = false;
    const recipeListEntryImage = document.createElement("img");
    recipeListEntryImage.classList.add("recipe-list-entry-image");
    database.getRecipeImage(recipe).then((url) => {
      if (url) {
        recipeListEntryImage.src = url;
        recipeListImageContainer.appendChild(recipeListEntryImage);
      } else {
        noimg = true;
        recipeListImageContainer.classList.add(
          "shopping-list-entry-div-no-image"
        );

        recipeTitleDiv.classList.add("recipe-title-div-no-image");
      }
      database.getRecipe(recipe).then((recipeObject) => {
        recipeListEntryText.textContent = `${recipeObject.name}`;

        if (noimg) {
          console.log(recipeTitleDiv.offsetHeight);
          recipeListImageContainer.style.height = `${recipeTitleDiv.offsetHeight}px`;
        }
      });
    });
  }
}
