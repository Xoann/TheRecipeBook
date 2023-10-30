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
    const recipeListEntry = document.createElement("div");
    recipeListEntry.classList.add("shopping-list-entry-div");
    recipeContainer.appendChild(recipeListEntry);

    const recipeTitleDiv = document.createElement("div");
    recipeTitleDiv.classList.add("recipe-title-div");
    recipeListEntry.appendChild(recipeTitleDiv);

    const recipeListEntryText = document.createElement("h3");
    recipeListEntryText.classList.add("recipe-list-entry-text");
    recipeListEntryText.textContent = `${recipe}`;
    recipeTitleDiv.appendChild(recipeListEntryText);

    const recipeListEntryImage = document.createElement("img");
    recipeListEntryImage.classList.add("recipe-list-entry-image");
    database.getRecipeImage(recipe).then((url) => {
      recipeListEntryImage.src = url;
    });

    recipeListEntry.appendChild(recipeListEntryImage);
  }
}
