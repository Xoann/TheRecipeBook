var currentUid;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    currentUid = firebase.auth().currentUser.uid;
    console.log(firebase.auth().currentUser.uid);
    console.log("uid found");

    const dbr = firebase.database().ref(`${currentUid}/`);

    dbr.once("value").then((snapshot) => {
      const recipes = snapshot.val();
      const imageNames = [];

      for (const key in recipes) {
        if (recipes.hasOwnProperty(key)) {
          imageNames.push(key);
        }
      }
      console.log(recipes);
      const imageURLs = getImageURLs(imageNames, currentUid);
      displayRecipes(recipes, imageNames, imageURLs);
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

function displayRecipes(recipes, recipeNames, imageURLs) {
  for (let i = 0; i < recipeNames.length; i++) {
    const recipeContainer =
      document.getElementsByClassName("recipe-container")[0];

    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-div");

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
