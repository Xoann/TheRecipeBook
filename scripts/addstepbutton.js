export function addStep(listContainer, stepIdentifier) {
  let itemCount = document.getElementsByClassName("step-item").length;
  const listItem = document.createElement("div");
  listItem.classList.add("step-item");
  listItem.classList.add(`step-item_${stepIdentifier}`);

  //Create number label
  const number = document.createElement("label");
  number.classList.add("step-number");
  number.id = `step-number_${itemCount}`;
  number.innerText = `${itemCount + 1}:`;

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

  stepInput.id = `recipe-step_${itemCount}`;

  //Create Minus button
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-item");
  removeButton.innerText = "-";
  removeButton.classList.add("plus-button");

  //When minus button clicked:
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
  listItem.append(number);
  listItem.appendChild(stepInput);
  listItem.appendChild(removeButton);
  listContainer.appendChild(listItem);

  //New Step animation
  setTimeout(function () {
    stepInput.classList.add("textarea-animation");
    listItem.classList.add("step-container-animation");
  }, 10);

  itemCount++;
}
