var currentUid;
let recipes;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUid = firebase.auth().currentUser.uid;
    console.log(firebase.auth().currentUser.uid);

    const usernameElement = document.getElementById("username");
    // usernameElement.innerHTML = firebase.auth().currentUser.;

    const dbr = firebase.database().ref(`${currentUid}/recipes/`);

    dbr.once("value").then((snapshot) => {
      recipes = snapshot.val();
      const imageNames = [];

      for (const key in recipes) {
        if (recipes.hasOwnProperty(key)) {
          imageNames.push(key);
        }
      }
      displayRecipes(imageNames);
    });
  } else {
    console.log("uid not found");
  }
});

async function getImageURLs(image_names, uid) {
  const storageRef = firebase.storage().ref();
  const imageURLs = {};

  for (let i = 0; i < image_names.length; i++) {
    const imageName = image_names[i];
    const imageRef = storageRef.child(uid).child("images").child(imageName);

    await imageRef.getDownloadURL().then((url) => {
      imageURLs[imageName] = url;
    });
  }
  return imageURLs;
}

function displayRecipes(recipeNames) {
  const imageURLs = getImageURLs(recipeNames, currentUid);

  for (let i = 0; i < recipeNames.length; i++) {
    generateRecipeModal(recipeNames[i]);

    const recipeContainer =
      document.getElementsByClassName("recipe-container")[0];

    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-div");

    recipeDiv.addEventListener("click", () =>
      displayRecipeModal(recipeNames[i])
    );

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const recipeImg = document.createElement("img");
    recipeImg.classList.add("recipe-img");
    loadImg(recipeImg, imageURLs, recipeNames[i]);

    const gradientOverlay = document.createElement("div");
    gradientOverlay.classList.add("gradient-overlay");

    const recipeElements = document.createElement("div");
    recipeElements.classList.add("recipe-elements");

    const recipeNameElement = document.createElement("h2");
    recipeNameElement.classList.add("recipe-name");
    recipeNameElement.innerHTML = recipeNames[i];

    const recipeDescription = document.createElement("div");
    recipeDescription.classList.add("desc-div");
    recipeDescription.innerHTML = recipes[recipeNames[i]].recipeDesc;

    recipeContainer.appendChild(recipeDiv);
    recipeDiv.appendChild(imgContainer);
    imgContainer.appendChild(recipeImg);
    imgContainer.appendChild(gradientOverlay);
    recipeDiv.appendChild(recipeElements);
    recipeElements.appendChild(recipeNameElement);
    recipeElements.appendChild(recipeDescription);
  }
}

async function loadImg(imgElement, imgURLs, imageName) {
  const imageURLs = await imgURLs;
  const imageURL = await imageURLs[imageName];
  imgElement.src = imageURL;
}

////////////////////////
/// SEARCH BAR CODE ///
////////////////////////

const searchInput = document.getElementById("search-input");
let searchQuery = "";

function narrowSearch(search) {
  const matches = [];
  const names = Object.keys(recipes);

  for (const recipe of names) {
    if (recipe.includes(search)) {
      matches.push(recipe);
    }
  }
  return matches;
}

function updateRecipes(recipeNames) {
  const recipeContainer = document.getElementById("recipe-container");
  recipeContainer.innerHTML = "";
  displayRecipes(recipeNames);
}

searchInput.addEventListener("input", function (event) {
  searchQuery = event.target.value;

  const searchedRecipeNames = narrowSearch(searchQuery);
  updateRecipes(searchedRecipeNames);
});

//////////////////////////////
/// Generate Recipe Modals ///
//////////////////////////////

function generateRecipeModal(recipeName) {
  const modalElement = document.createElement("div");
  modalElement.classList.add("modal");
  modalElement.id = recipeName;

  const modalContentElement = document.createElement("div");
  modalContentElement.classList.add("modal-content");

  const recipeNameElement = document.createElement("h2");
  recipeNameElement.classList.add("modal-recipe-name");
  recipeNameElement.textContent = recipeName;

  const closeModalButton = document.createElement("span");
  closeModalButton.id = "closeModalButton";
  closeModalButton.textContent = "Close";

  closeModalButton.addEventListener("click", () => closeModal(modalElement));

  window.addEventListener("click", (event) => {
    if (event.target === modalElement) {
      closeModal(modalElement);
    }
  });

  const documentBody = document.getElementById("body");

  documentBody.appendChild(modalElement);
  modalElement.appendChild(modalContentElement);
  modalContentElement.appendChild(recipeNameElement);
  modalContentElement.appendChild(closeModalButton);
}

// Modal window interactivity

function displayRecipeModal(modalId) {
  const modal = document.getElementById(modalId);
  console.log(modal);
  openModal(modal);
}

function openModal(modal) {
  modal.style.display = "block";
}

function closeModal(modal) {
  modal.style.display = "none";
}
