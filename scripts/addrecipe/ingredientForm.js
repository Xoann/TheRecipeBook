document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("add-recipe-form");
  const listContainer = document.getElementById("list-container-ingredients");
  const addItemButton = document.getElementById("add-ingredient");

  let itemCount = 0;
  const units = [
    "dr.",
    "smdg.",
    "pn.",
    "ds.",
    "ssp.",
    "csp.",
    "fl.dr.",
    "tsp.",
    "dsp.",
    "tbsp.",
    "oz.",
    "wgf.",
    "tcf.",
    "C",
    "pt.",
    "qt.",
    "gal.",
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
    input_name.placeholder = "Add an ingredient";

    const input_value = document.createElement("input");
    input_value.type = "number";
    input_value.classList.add("ingredient-amount");
    input_value.id = `ingredient_value_${itemCount}`;
    input_value.placeholder = "Amount";
    input_value.classList.add("ingredient-input");

    const input_unit = document.createElement("select");
    input_unit.id = `ingredient_unit_${itemCount}`;
    input_unit.classList.add("ingredient-unit");
    input_unit.classList.add("ingredient-input");

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-item");
    removeButton.classList.add("plus-button");
    removeButton.innerText = "-";
    removeButton.addEventListener("click", function () {
      listContainer.removeChild(listItem);
    });

    listItem.appendChild(input_name);
    listItem.appendChild(input_value);
    listItem.appendChild(input_unit);

    for (let i = 0; i < units.length; i++) {
      const drop_down_option = document.createElement("option");
      drop_down_option.value = units[i];
      drop_down_option.text = units[i];
      input_unit.appendChild(drop_down_option);
    }

    listItem.appendChild(removeButton);
    listContainer.appendChild(listItem);

    itemCount++;
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

const userMenu = document.getElementsByClassName("user-menu")[0];
const usernameButtonOut = document.getElementById("username-button");
const usernameButtonIn = document.getElementById("username");
const userMenuItems = document.getElementsByClassName("user-menu-list-item");
let userMenuOpen = false;

window.addEventListener("click", function (event) {
  console.log("window click");
  console.log(userMenu.style.display);
  if (
    (event.target === usernameButtonOut || event.target === usernameButtonIn) &&
    !userMenuOpen
  ) {
    usernameButtonOut.classList.add("user-menu-button-maintain-hover");
    userMenuOpen = true;
    console.log("username clicked");
    userMenu.classList.add("user-menu-appear");
    for (const item of userMenuItems) {
      item.classList.add("user-menu-item-appear");
    }
    this.setTimeout(function () {
      for (const item of userMenuItems) {
        console.log("block");
        item.classList.add("user-menu-item-block");
      }
    }, 40);
  } else if (event.target !== userMenu && userMenuOpen) {
    usernameButtonOut.classList.remove("user-menu-button-maintain-hover");
    userMenuOpen = false;
    console.log("not username clicked");
    userMenu.classList.remove("user-menu-appear");
    for (const item of userMenuItems) {
      item.classList.remove("user-menu-item-appear");
    }
    this.setTimeout(function () {
      console.log("none");
      for (const item of userMenuItems) {
        item.classList.remove("user-menu-item-block");
      }
    }, 20);
  }
});
