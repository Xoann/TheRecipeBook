export function addIngredient(listContainer, ingredientIdentifier) {
  let itemCount = document.getElementsByClassName(
    `ingredient-row-container_${ingredientIdentifier}`
  ).length;

  const units = [
    "mg.",
    "g.",
    "kg",
    "oz.",
    "lbs",
    "mL.",
    "L.",
    "drop",
    "tsp.",
    "tbsp.",
    "cup.",
    "pt.",
    "qt.",
    "gal.",
  ];

  const listItem = document.createElement("div");
  listItem.classList.add(`ingredient-row-container_${ingredientIdentifier}`);
  listItem.classList.add("ingredient-row-container");

  const input_name = document.createElement("input");
  input_name.type = "text";
  input_name.id = `ingredient_${ingredientIdentifier}_${itemCount}`;
  input_name.className = `ingredient_${itemCount}`;
  input_name.classList.add("ingredient-name");
  input_name.classList.add(`ingredient-name_${ingredientIdentifier}`);
  input_name.classList.add("ingredient-input");
  input_name.classList.add("input-transition");
  input_name.placeholder = "Add an ingredient";
  input_name.setAttribute("oninput", "limitInputLength(this, 40)");

  const input_value = document.createElement("input");
  input_value.type = "text";
  input_value.classList.add("ingredient-amount");
  input_value.classList.add(`ingredient-amount_${ingredientIdentifier}`);
  input_value.id = `ingredient_value_${ingredientIdentifier}_${itemCount}`;
  input_value.placeholder = "Amount";
  input_value.classList.add("ingredient-input");
  input_value.classList.add("input-transition");
  input_value.setAttribute("oninput", "restrictAmountInput(this, 8)");

  const unitDiv = document.createElement("fieldset");

  const unitInput = document.createElement("input");
  unitInput.classList.add("ingredient-input");
  unitInput.classList.add("unit-input");
  unitInput.classList.add(`ingredient-unit_${ingredientIdentifier}`);
  unitInput.classList.add("input-transition");
  unitInput.autocomplete = "off";
  unitInput.role = "combobox";
  unitInput.id = `ingredient_unit_${ingredientIdentifier}_${itemCount}`;
  unitInput.name = "unitslist";
  unitInput.placeholder = "Unit";
  unitInput.type = "text";
  unitInput.addEventListener("input", function () {
    limitInputLength(unitInput, 8);
  });

  const unitDatalist = document.createElement("datalist");
  unitDatalist.id = "units";
  unitDatalist.classList.add("data-list");
  unitDiv.appendChild(unitInput);
  unitDiv.appendChild(unitDatalist);

  for (const unit of units) {
    const option = document.createElement("option");
    option.innerHTML = unit;
    option.value = unit;
    unitDatalist.appendChild(option);
  }

  unitInput.onfocus = function () {
    unitDatalist.style.display = "block";
  };
  for (let option of unitDatalist.options) {
    option.onclick = function () {
      unitInput.value = option.value;
      unitDatalist.style.display = "none";
      unitInput.style.borderRadius = "5px";
    };
  }

  var currentFocus = -1;
  unitInput.oninput = function () {
    currentFocus = -1;
    var text = unitInput.value.toUpperCase();
    for (let option of unitDatalist.options) {
      if (option.value.toUpperCase().indexOf(text) > -1) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    }
  };

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
        input_name.classList.remove("ingredient-animation");
        input_value.classList.remove("ingredient-animation");
        unitInput.classList.remove("ingredient-animation");

        setTimeout(function () {
          listContainer.removeChild(listItem);
          let nameList = document.getElementsByClassName(
            `ingredient-name_${ingredientIdentifier}`
          );
          let amountList = document.getElementsByClassName(
            `ingredient-amount_${ingredientIdentifier}`
          );
          let unitList = document.getElementsByClassName(
            `ingredient-unit_${ingredientIdentifier}`
          );
          itemCount = document.getElementsByClassName(
            `ingredient-row-container_${ingredientIdentifier}`
          ).length;
          for (let i = 0; i < itemCount; i++) {
            nameList[i].id = `ingredient_${ingredientIdentifier}_${i}`;
            amountList[i].id = `ingredient_value_${ingredientIdentifier}_${i}`;
            unitList[i].id = `ingredient_unit_${ingredientIdentifier}_${i}`;
          }
        }, 50);
      });
    })
    .catch((error) => {
      console.error("Error loading SVG:", error);
    });

  listItem.appendChild(input_name);
  listItem.appendChild(input_value);
  listItem.appendChild(unitDiv);
  listContainer.appendChild(listItem);

  setTimeout(function () {
    input_name.classList.add("ingredient-animation");
    input_value.classList.add("ingredient-animation");
    unitInput.classList.add("ingredient-animation");
  }, 10);
}

function limitInputLength(element, maxLength) {
  let inputValue = element.value.toString();

  if (inputValue.length > maxLength) {
    element.value = inputValue.slice(0, maxLength);
  }
}
