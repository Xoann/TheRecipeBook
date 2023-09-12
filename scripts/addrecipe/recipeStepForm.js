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
      const formData = new FormData(form);
      for (const [key, value] of formData.entries()) {
          console.log(`Item ${key}: ${value}`);
      }
  });
});