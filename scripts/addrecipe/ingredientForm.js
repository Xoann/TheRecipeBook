document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("add-recipe-form");
  const listContainer = document.getElementById("list-container-ingredients");
  const addItemButton = document.getElementById("add-ingredient");

  let itemCount = 0;
  const units = ['mg', 'g', 'kg' ,'tsp','tbsp','cups', 'L' ,'mL']

  addItemButton.addEventListener("click", function() {
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");

        const input_name = document.createElement("input");
        input_name.type = "text";
        input_name.id = `ingredient_${itemCount}`;
        input_name.className = `ingredient_${itemCount}`;
        input_name.placeholder = "Enter an ingredient";

        const input_value = document.createElement("input");
        input_value.type = "number";
        input_value.id = `ingredient_value_${itemCount}`;
        input_value.placeholder = "Amount";

        const input_unit = document.createElement("select");
        input_unit.id = `ingredient_unit_${itemCount}`;

        const removeButton = document.createElement("span");
        removeButton.classList.add("remove-item");
        removeButton.innerText = "Remove";
        removeButton.addEventListener("click", function() {
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

  form.addEventListener("submit", function(event) {
      event.preventDefault();

      // Retrieve the values of the list items and do something with them
      /*
      const formData = new FormData(form);
      for (const [key, value] of formData.entries()) {
          console.log(`Item ${key}: ${value}`);
      }
      */
  });
});