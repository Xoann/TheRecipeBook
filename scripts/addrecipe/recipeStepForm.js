import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBdZGDDPJC-PYljU0HDnnZi64Z6do0w7K0",
    authDomain: "recipebook2-a9e9a.firebaseapp.com",
    databaseURL: "https://recipebook2-a9e9a-default-rtdb.firebaseio.com",
    projectId: "recipebook2-a9e9a",
    storageBucket: "recipebook2-a9e9a.appspot.com",
    messagingSenderId: "384328070783",
    appId: "1:384328070783:web:dbdb4004f591e84682314a"
  };

firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("add-recipe-form");
  const listContainer = document.getElementById("list-container-steps");
  const addItemButton = document.getElementById("add-step");

  let itemCount = 0;

  addItemButton.addEventListener("click", function() {
      const listItem = document.createElement("div");
      listItem.classList.add("list-item");

      const input = document.createElement("textarea");
      input.id = "recipe-step";
      input.cols = "30";
      input.rows = "10";
      input.placeholder = "Enter a step";

      const removeButton = document.createElement("span");
      removeButton.classList.add("remove-item");
      removeButton.innerText = "Remove";
      removeButton.addEventListener("click", function() {
          listContainer.removeChild(listItem);
      });

      listItem.appendChild(input);
      listItem.appendChild(removeButton);
      listContainer.appendChild(listItem);

      itemCount++;
  });

  form.addEventListener("submit", function(event) {
      event.preventDefault();

      // Retrieve the values of the list items and do something with them
      /*
      const formData = new FormData(form);
      for (const [key, value] of formData.entries()) {
          console.log(`Item ${key}: ${value}`);
      }
      */
  });
});

//Submit recipe name, recipe desc, cooktime, preptime to database
var addRecipeDB = firebase.database().ref("addRecipe");

document.getElementById("addRecipeForm").addEventListener("submit", submitForm);

function submitForm(e){
    e.preventDefault();

    var recipeName = getElementVal("recipeName");
    var recipeDesc = getElementVal("recipeDesc");
    var cookTime = getElementVal("cookTime");
    var prepTime = getElementVal("prepTime");

    console.log(recipeName, recipeDesc, cookTime, prepTime);
    saveMessages(recipeName, recipeDesc, cookTime, prepTime);
}


const getElementVal = (id) => {
    return document.getElementById(id).value;
};

const saveMessages = (recipeName, recipeDesc, cookTime, prepTime) => {
    var newAddRecipe = addRecipeDB.push();

    const db=getDatabase();
    newAddRecipe.set(ref(db, 'users/' + userId),{
        recipeName:recipeName,
        recipeDesc:recipeDesc,
        cookTime:cookTime,
        prepTime:prepTime
    });
};