// Load shopping list and recipes

document.addEventListener("DOMContentLoaded", function () {
  const ingredients = JSON.parse(window.localStorage.getItem("ingredients"));
  console.log(ingredients);
  const recipes = JSON.parse(localStorage.getItem("recipes"));
  console.log(recipes);
  const imgURLs = JSON.parse(localStorage.getItem("recipeImages"));
  console.log(imgURLs);
  generateDOMContent(ingredients, recipes, imgURLs);
});

function generateDOMContent(ingredients, recipes, imgUrls) {
  const ingredientContainer = document.querySelector(".ingredient-container");
  const recipeContainer = document.querySelector(".recipe-container");

  // Display Ingredients
  for (let i = 0; i < ingredients.length; i++) {
    const ingredientObj = ingredients[i];
    const ingredient = ingredientObj["ingredient"];
    const unit = ingredientObj["unit"];
    const value = ingredientObj["value"];

    const shoppingListEntry = document.createElement("li");
    shoppingListEntry.classList.add("shopping-list-entry");
    if (unit) {
      shoppingListEntry.textContent = `${value} ${unit} of ${ingredient}`;
    } else {
      shoppingListEntry.textContent = `${value} ${ingredient}`;
    }

    ingredientContainer.appendChild(shoppingListEntry);
  }

  // Display Recipes
  for (const recipe of recipes) {
    // console.log(recipes[recipeName]);
    const recipeListEntry = document.createElement("div");
    recipeListEntry.classList.add("shopping-list-entry-div");
    recipeContainer.appendChild(recipeListEntry);

    const recipeListEntryText = document.createElement("h3");
    recipeListEntryText.classList.add("recipe-list-entry-text");
    recipeListEntryText.textContent = `${recipe}`;
    recipeListEntry.appendChild(recipeListEntryText);

    const recipeListEntryImage = document.createElement("img");
    recipeListEntryImage.classList.add("recipe-list-entry-image");
    recipeListEntryImage.src = imgUrls[recipe];
    recipeListEntry.appendChild(recipeListEntryImage);
  }
}
