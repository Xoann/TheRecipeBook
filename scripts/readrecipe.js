const uid = "users";
const dbr = firebase.database().ref(`${uid}/`);

dbr.once('value').then((snapshot) => {
  const recipes = snapshot.val();
  console.log(recipes);

  const recipeContainer = document.getElementById("recipe-container")

  for (const key in recipes) {
    if (recipes.hasOwnProperty(key)) {
      const value = recipes[key];
  
      const recipe_div = document.createElement('div');
      const recipe = document.createElement('h2')
      recipe.innerHTML = key;

      recipeContainer.appendChild(recipe_div)
      recipe_div.appendChild(recipe)
    }
  }
});

