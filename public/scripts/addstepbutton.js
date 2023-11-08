export function addStep(listContainer, stepIdentifier) {
  let itemCount = document.getElementsByClassName(
    `step-item_${stepIdentifier}`
  ).length;
  const listItem = document.createElement("div");
  listItem.classList.add("step-item");
  listItem.classList.add(`step-item_${stepIdentifier}`);

  //Create number label
  const numberContainer = document.createElement("div");
  numberContainer.classList.add("number-container");

  const number = document.createElement("label");
  number.classList.add("step-number");
  number.id = `step-number_${itemCount}`;
  number.innerText = `${itemCount + 1}:`;

  numberContainer.appendChild(number);

  //Create textarea
  const paragraph = document.createElement("p");
  paragraph.classList.add("resizable-p");
  const stepInput = document.createElement("span");

  stepInput.setAttribute("role", "textbox");
  stepInput.contentEditable = true;
  stepInput.classList.add("input-transition");
  stepInput.classList.add("details-input");
  stepInput.classList.add("textarea");
  stepInput.classList.add("step-input");
  stepInput.classList.add(`step-input_${stepIdentifier}`);
  stepInput.addEventListener("input", (e) => {
    limitSpanLength(e.target, 300);
  });
  stepInput.id = `recipe-step_${itemCount}`;

  //Create Minus button
  let removeButton;
  fetch("../svgs/x.svg")
    .then((response) => response.text())
    .then((svgData) => {
      const parser = new DOMParser();
      const svgDOM = parser.parseFromString(svgData, "image/svg+xml");
      removeButton = svgDOM.querySelector("svg");
      removeButton.classList.add("edit-plus-button");
      listItem.appendChild(removeButton);
      removeButton.classList.add("plus-button");

      removeButton.addEventListener("click", function () {
        //remove animation
        stepInput.classList.remove("textarea-animation");
        listItem.classList.remove("step-container-animation");
        setTimeout(function () {
          listContainer.removeChild(listItem);
          itemCount--;
          //Reassign indexes for label and ids
          let labelList = document.getElementsByClassName("step-number");
          let textareaList = document.getElementsByClassName("step-input");
          itemCount = document.getElementsByClassName("step-item").length;
          for (let i = 0; i < itemCount; i++) {
            labelList[i].id = `step-number_${i}`;
            labelList[i].innerText = `${i + 1}:`;
            textareaList[i].id = `recipe-step_${i}`;
          }
        }, 40);
      });
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
    });
  listItem.append(numberContainer);
  listItem.appendChild(stepInput);
  listContainer.appendChild(listItem);

  //New Step animation
  setTimeout(function () {
    stepInput.classList.add("textarea-animation");
    listItem.classList.add("step-container-animation");
  }, 10);

  itemCount++;
}

function limitSpanLength(element, maxLength) {
  let inputValue = element.innerHTML.toString();
  console.log(inputValue);
  if (inputValue.length > maxLength) {
    element.innerHTML = inputValue.slice(0, maxLength);
  }
}
