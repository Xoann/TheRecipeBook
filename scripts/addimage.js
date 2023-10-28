export function handleFileChange(
  input,
  imagesArray,
  imageContainer,
  imageForm,
  imageIdentifier
) {
  console.log(input.files);
  const files = input.files;

  //remove this for several images
  if (document.getElementsByClassName("display-image").length >= 1) {
    deleteImage(imageContainer, imagesArray, imageForm, imageIdentifier, 0);
  }

  for (let i = 0; i < files.length; i++) {
    imagesArray.push(files[i]);
  }
  imageForm.reset();
  displayImage(imageContainer, imagesArray, imageForm, imageIdentifier);
}

export function displayImage(
  imageContainer,
  imagesArray,
  imageForm,
  imageIdentifier
) {
  imageContainer.innerHTML = "";
  console.log(imagesArray);
  imagesArray.forEach((image, index) => {
    let imgDiv = document.createElement("div");
    imgDiv.classList.add("display-image");
    imgDiv.id = `display-image_${imageIdentifier}`;

    imageContainer.appendChild(imgDiv);

    let img = document.createElement("img");

    img.src = URL.createObjectURL(image);
    img.alt = "image";
    img.id = "recipeImg";
    img.classList.add(`recipeImg_${imageIdentifier}`);

    imgDiv.appendChild(img);

    fetch("../svgs/x.svg")
      .then((response) => response.text())
      .then((svgData) => {
        const parser = new DOMParser();
        const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
        const svgElement = svgDOM.querySelector("svg");
        svgElement.classList.add("close");
        imgDiv.appendChild(svgElement);
        svgElement.onclick = function () {
          deleteImage(
            imageContainer,
            imagesArray,
            index,
            imageForm,
            imageIdentifier
          );
        };
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
  });
}

export function deleteImage(
  imageContainer,
  imagesArray,
  imageForm,
  imageIdentifier,
  index
) {
  imagesArray.splice(index, 1);
  displayImage(imageContainer, imagesArray, imageForm, imageIdentifier);
}

//https://www.youtube.com/watch?v=EaBSeNSc-2c
