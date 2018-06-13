document.addEventListener("DOMContentLoaded", function(event) {
  // const ingredients = ['chocolate chips', 'mint', 'peaches', 'cookies', 'fudge', 'cherries', 'almonds', 'pecans', 'M&Ms', 'cookie dough'];
  // const checkedIngredients = []
  //
  // let ingredientsContainer = document.getElementById("ingredients")
  // let ingredientList = document.getElementById("ingredient-list")
  // let submitButton = document.getElementById('submit')
  // let iceCreamForm = document.getElementById('iceCreamForm')
  // let recipeList = document.getElementById('recipe-list')
  //
  //
  // ingredientList.addEventListener('change', function(event){
  //   if(event.target.checked){
  //     // console.log(event.target.id, " was checked")
  //     checkedIngredients.push(event.target.id);
  //   } else {
  //     let index = checkedIngredients.findIndex( (ing) => ( ing === event.target.id));
  //     checkedIngredients.splice(index, 1);
  //   }
  // })
  //
  // iceCreamForm.addEventListener('submit', function(event){
  //   event.preventDefault();
  //   let card = document.createElement('li')
  //   card.innerHTML = "<li><div><h4>Some Icezy Creamm</h4><h5>Ingredients:</h5><ul></ul></div></li>"
  //
  //   recipeList.appendChild(card)
  // })
  //
  // // submitButton = document.getElementById('')
  //
  // ingredients.forEach( (ingredient) => {
  //   let listItem = document.createElement('li')
  //   listItem.innerHTML = `${ingredient} <input type='checkbox' id=${ingredient}>`
  //   ingredientList.appendChild(listItem)
  // });


  const ingredientsContainer = document.getElementById('ingredients-container')

  function fetchIngredients() {
    fetch('http://localhost:3000/ingredients').then(r=>r.json()).then(renderIngredients)
  }

  function renderIngredients(ingredientsObj) {
    ingredientsObj.forEach(renderIngredient)
  }

  function renderIngredient(ingredientObj) {
    const ingredientHTML = `<li><input type='checkbox' id='${ingredientObj.id}'> ${ingredientObj.name} </li>`
    ingredientsContainer.innerHTML += ingredientHTML
  }

  fetchIngredients()

  const myIceCreams = document.getElementById('myIceCreams').children()[0]

  function fetchIngredients() {
    fetch('http://localhost:3000/ice_creams').then(r=>r.json()).then(renderIceCreams)
  }

  function renderIceCreams(iceCreamsObj) {
    iceCreamsObj.forEach(renderIceCream)
  }

  function renderIceCream(iceCreamsObj) {
    const iceCreamsHTML = `<li><input type='checkbox' id='${ingredientObj.id}'> ${ingredientObj.name} </li>`
    ingredientsContainer.innerHTML += ingredientHTML
  }

  fetchIngredients()
});
