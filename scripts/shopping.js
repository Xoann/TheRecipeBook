var currentUid;

// Load shopping list and recipes
firebase.auth().onAuthStateChanged((user) => {
  currentUid = firebase.auth().currentUser.uid;
  getShoppingListData().then((data) => {
    generateDOMContent(data[0], data[1], data[2]);
  });
});

function getShoppingListData() {
  const docRef = firebase.firestore().collection("users").doc(currentUid);
  return docRef.get().then((doc) => {
    const ingredients = JSON.parse(doc.data().shoppingIngredients);
    const shoppingList = JSON.parse(doc.data().shoppingListRecipes);
    const imageUrls = JSON.parse(doc.data().shoppingListImages);
    return [ingredients, shoppingList, imageUrls];
  });
}

async function generateDOMContent(ingredients, recipes, imgUrls) {
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

    const recipeTitleDiv = document.createElement("div");
    recipeTitleDiv.classList.add("recipe-title-div");
    recipeListEntry.appendChild(recipeTitleDiv);

    const recipeListEntryText = document.createElement("h3");
    recipeListEntryText.classList.add("recipe-list-entry-text");
    recipeListEntryText.textContent = `${recipe}`;
    recipeTitleDiv.appendChild(recipeListEntryText);

    const recipeListEntryImage = document.createElement("img");
    recipeListEntryImage.classList.add("recipe-list-entry-image");
    recipeListEntryImage.src = imgUrls[recipe];
    recipeListEntry.appendChild(recipeListEntryImage);
  }
}
