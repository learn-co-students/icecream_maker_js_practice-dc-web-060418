const ingredientKey = [
  "secret ingredient",
  "vanilla",
  "chocolate",
  "mint",
  "cherries",
  "sprinkles",
  "walnuts"
];

document.addEventListener("DOMContentLoaded", function() {
  fetchAllIngredients();
  fetchAllIceCream();

  let createButton = document.getElementById("create");
  createButton.addEventListener("click", function(event) {
    event.preventDefault();

    let form = document.getElementById("iceCreamForm");
    createIceCream();
    form.reset();
  });
});

let ul = document.getElementById("iceCreamCheckboxes");
let li = document.createElement("li");

function createIceCream() {
  let name = document.getElementById("iceCreamName").value;

  let ingredients = ul.getElementsByTagName("input");
  let ingredientsArray = Array.from(ingredients);

  let intermediateIngredientsArray = ingredientsArray.filter(function(
    ingredient
  ) {
    return ingredient.checked === true;
  });
  let finalIngredientsArray = intermediateIngredientsArray.map(function(
    ingredient
  ) {
    return ingredient.dataset.id;
  });
  postIceCream(name, finalIngredientsArray);
}

function postIceCream(name, finalIngredientsArray) {
  console.log(name, finalIngredientsArray);
  let data = { name: name, ingredients: finalIngredientsArray };
  fetch(`http://localhost:3000/ice_cream`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(iceCream => {
      renderIceCream(iceCream);
    });
}

function fetchAllIngredients() {
  fetch(`http://localhost:3000/ingredient`)
    .then(response => response.json())
    .then(jsonData =>
      jsonData.forEach(function(ingredient) {
        renderIngredient(ingredient);
      })
    );
}

function fetchAllIceCream() {
  fetch(`http://localhost:3000/ice_cream`)
    .then(response => response.json())
    .then(jsonData =>
      jsonData.forEach(function(iceCream) {
        renderIceCream(iceCream);
      })
    );
}

function deleteIceCream(iceCream, event) {
  fetch(`http://localhost:3000/ice_cream/${iceCream.id}`, {
    method: "DELETE"
  }).then(response => {
    let container = document.getElementById("iceCreamGrid");
    container.innerHTML = "";
    fetchAllIceCream();
  });
}

function patchIceCream(name, iceCream, finalIngredientsArray) {
  let data = { name: name, ingredients: finalIngredientsArray };
  fetch(`http://localhost:3000/ice_cream/${iceCream.id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => {
    let container = document.getElementById("iceCreamGrid");
    container.innerHTML = "";
    fetchAllIceCream();
  });
}

function editIceCream(iceCream) {
  let iceCreamDiv = document.getElementById(`icecreamdiv-${iceCream.id}`);
  iceCreamDiv.innerHTML = "";

  iceCreamDiv.innerHTML = `<input id="edit-name-${
    iceCream.id
  }" type=text value="${iceCream.name}""></input>`;

  let pic = document.createElement("img");
  pic.src = "icecream.jpeg";
  iceCreamDiv.appendChild(pic);

  let submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.id = `submit-${iceCream.id}`;
  submitButton.style = "width:100px;height:50px;";
  iceCreamDiv.appendChild(submitButton);

  let ul = document.createElement("ul");
  iceCreamDiv.appendChild(ul);

  fetch(`http://localhost:3000/ingredient`)
    .then(response => response.json())
    .then(jsonData =>
      jsonData.forEach(function(ingredient) {
        let li = document.createElement("li");
        li.innerHTML = `${ingredient.name} <input data-id="${
          ingredient.id
        }"" type="checkbox" value="${ingredient.name}"></input>`;
        ul.appendChild(li);
      })
    );

  submitButton.addEventListener("click", function() {
    let name = document.getElementById(`edit-name-${iceCream.id}`).value;

    let ingredients = ul.getElementsByTagName("input");
    let ingredientsArray = Array.from(ingredients);

    let intermediateIngredientsArray = ingredientsArray.filter(function(
      ingredient
    ) {
      return ingredient.checked === true;
    });
    let finalIngredientsArray = intermediateIngredientsArray.map(function(
      ingredient
    ) {
      return ingredient.dataset.id;
    });

    patchIceCream(name, iceCream, finalIngredientsArray);
  });
}

function renderIngredient(ingredient) {
  let ul = document.getElementById("iceCreamCheckboxes");
  let li = document.createElement("li");
  li.innerHTML = `${ingredient.name} <input data-id="${
    ingredient.id
  }"" type="checkbox" value="${ingredient.name}"></input>`;
  ul.appendChild(li);
}

function renderIceCream(iceCream) {
  let iceCreamGrid = document.getElementById("iceCreamGrid");
  let iceCreamDiv = document.createElement("div");
  iceCreamDiv.id = `icecreamdiv-${iceCream.id}`;

  iceCreamGrid.appendChild(iceCreamDiv);
  iceCreamDiv.innerHTML = `<h2>${iceCream.name}</h2>`;

  let pic = document.createElement("img");
  pic.src = "icecream.jpeg";
  iceCreamDiv.appendChild(pic);

  let editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.id = `edit-${iceCream.id}`;
  editButton.style = "width:80px;height:50px;";
  iceCreamDiv.appendChild(editButton);
  editButton.addEventListener("click", function(event) {
    editIceCream(iceCream, event.target.id);
  });

  let span = document.createElement("span");
  span.innerHTML = "          ";
  iceCreamDiv.appendChild(span);

  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.id = `delete-${iceCream.id}`;
  deleteButton.style = "width:80px;height:50px;";
  iceCreamDiv.appendChild(deleteButton);
  deleteButton.addEventListener("click", function(event) {
    deleteIceCream(iceCream, event.target.id);
  });

  let ingredientsLabel = document.createElement("h4");
  ingredientsLabel.innerHTML = "Ingredients:";
  iceCreamDiv.appendChild(ingredientsLabel);

  let ingredientsList = document.createElement("ul");
  ingredientsList.id = `ingredient-list-${iceCream.id}`;

  iceCreamDiv.appendChild(ingredientsList);

  renderIngredientList(iceCream, iceCream.ingredients);
}

function renderIngredientList(iceCream, ingredients) {
  let ingredientsList = document.getElementById(
    `ingredient-list-${iceCream.id}`
  );
  ingredients.forEach(function(ingredient) {
    let li = document.createElement("li");
    li.innerHTML = `${ingredientKey[ingredient]}`;
    ingredientsList.appendChild(li);
  });
}
