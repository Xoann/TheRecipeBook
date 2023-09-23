const uid = "users";
const dbr = firebase.database().ref(`${uid}/`);

dbr.once("value").then((snapshot) => {
  const recipes = snapshot.val();
  const imageNames = [];
  const recipeContainer = document.getElementById("recipe-container");

  for (const key in recipes) {
    if (recipes.hasOwnProperty(key)) {
      const value = recipes[key];
      imageNames.push(key);
    }
  }
  imageURLs = getImageURLs(imageNames, uid);
  console.log(imageURLs);
});

function getImageURLs(image_names, uid) {
  const storageRef = firebase.storage().ref();
  const imageURLs = [];

  for (let i = 0; i < image_names.length; i++) {
    const imageRef = storageRef
      .child(uid)
      .child("images")
      .child(image_names[i]);

    imageRef.getDownloadURL().then((url) => {
      imageURLs.push(url);
    });
  }
  return imageURLs;
}
