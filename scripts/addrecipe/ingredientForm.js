document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addRecipeForm");
  const listContainer = document.getElementById("list-container-ingredients");
  const addItemButton = document.getElementById("add-ingredient");

  let itemCount = 0;
  const units = [
    "Grams",
    "Ounces",
    "lbs",
    "kg",
    "Liters",
    "drop",
    "tsp.",
    "tbsp.",
    "pt.",
    "qt.",
    // "gal.",
  ];

  addItemButton.addEventListener("click", function () {
    const listItem = document.createElement("div");
    listItem.classList.add("ingredient-row-container");

    const input_name = document.createElement("input");
    input_name.type = "text";
    input_name.id = `ingredient_${itemCount}`;
    input_name.className = `ingredient_${itemCount}`;
    input_name.classList.add("ingredient-name");
    input_name.classList.add("ingredient-input");
    input_name.classList.add("input-transition");
    input_name.placeholder = "Add an ingredient";

    const input_value = document.createElement("input");
    input_value.type = "number";
    input_value.classList.add("ingredient-amount");
    input_value.id = `ingredient_value_${itemCount}`;
    input_value.placeholder = "Amount";
    input_value.classList.add("ingredient-input");
    input_value.classList.add("input-transition");
    input_value.setAttribute("oninput", "limitInputLength(this, 4)");

    // const input_unit = document.createElement("input");
    // input_unit.setAttribute("list", "units");
    // input_unit.id = `ingredient_unit_${itemCount}`;
    // input_unit.classList.add("ingredient-unit");
    // input_unit.classList.add("ingredient-input");
    // input_unit.placeholder = "Unit";
    const unitDiv = document.createElement("fieldset");
    // unitDiv.classList.add("unit-dropdown");

    const unitInput = document.createElement("input");
    unitInput.classList.add("ingredient-input");
    unitInput.classList.add("unit-input");
    unitInput.classList.add("input-transition");
    unitInput.autocomplete = "off";
    unitInput.role = "combobox";
    unitInput.list = "";
    unitInput.id = `ingredient_unit_${itemCount}`;
    unitInput.name = "unitslist";
    unitInput.placeholder = "Unit";

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

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-item");
    removeButton.classList.add("plus-button");
    removeButton.innerText = "-";
    removeButton.addEventListener("click", function () {
      input_name.classList.remove("ingredient-animation");
      input_value.classList.remove("ingredient-animation");
      unitInput.classList.remove("ingredient-animation");

      setTimeout(function () {
        listContainer.removeChild(listItem);
        let nameList = document.getElementsByClassName("ingredient-name");
        let amountList = document.getElementsByClassName("ingredient-amount");
        let unitList = document.getElementsByClassName("unit-input");
        itemCount--;
        console.log(itemCount);
        for (let i = 0; i < itemCount; i++) {
          console.log("changing");
          nameList[i].id = `ingredient_${i}`;
          amountList[i].id = `ingredient_value_${i}`;
          unitList[i].id = `ingredient_unit_${i}`;
        }
      }, 50);
    });

    listItem.appendChild(input_name);
    listItem.appendChild(input_value);
    listItem.appendChild(unitDiv);
    listItem.appendChild(removeButton);
    listContainer.appendChild(listItem);

    setTimeout(function () {
      input_name.classList.add("ingredient-animation");
      input_value.classList.add("ingredient-animation");
      unitInput.classList.add("ingredient-animation");
    }, 10);

    itemCount++;
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

window.addEventListener("click", function (event) {
  let datalistList = document.getElementsByClassName("data-list");
  let unitInputList = document.getElementsByClassName("unit-input");

  for (let i = 0; i < datalistList.length; i++) {
    if (
      datalistList[i].style.display === "block" &&
      event.target !== datalistList[i] &&
      event.target !== unitInputList[i]
    ) {
      datalistList[i].style.display = "none";
    }
  }
});

const userMenu = document.getElementsByClassName("user-menu")[0];
const usernameButtonOut = document.getElementById("username-button");
const usernameButtonIn = document.getElementById("username");
const userMenuItems = document.getElementsByClassName("user-menu-list-item");
let userMenuOpen = false;

window.addEventListener("click", function (event) {
  if (
    (event.target === usernameButtonOut || event.target === usernameButtonIn) &&
    !userMenuOpen
  ) {
    usernameButtonOut.classList.add("user-menu-button-maintain-hover");
    userMenuOpen = true;
    userMenu.classList.add("user-menu-appear");
    for (const item of userMenuItems) {
      item.classList.add("user-menu-item-appear");
    }
    this.setTimeout(function () {
      for (const item of userMenuItems) {
        item.classList.add("user-menu-item-block");
      }
    }, 40);
  } else if (event.target !== userMenu && userMenuOpen) {
    usernameButtonOut.classList.remove("user-menu-button-maintain-hover");
    userMenuOpen = false;
    userMenu.classList.remove("user-menu-appear");
    for (const item of userMenuItems) {
      item.classList.remove("user-menu-item-appear");
    }
    this.setTimeout(function () {
      for (const item of userMenuItems) {
        item.classList.remove("user-menu-item-block");
      }
    }, 20);
  }
});

function limitInputLength(element, maxLength) {
  let inputValue = element.value.toString();

  if (inputValue.length > maxLength) {
    element.value = inputValue.slice(0, maxLength);
  }
}
