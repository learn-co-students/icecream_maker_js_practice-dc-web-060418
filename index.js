document.addEventListener("DOMContentLoaded", function() {
  let iceCreamForm = document.getElementById('iceCreamForm');
  let iceCreamCheckboxes = document.getElementById('iceCreamCheckboxes');
  let iceCreamGrid = document.getElementById('iceCreamGrid')

  let ingredientArray;
  let iceCreamArray;

  iceCreamForm.addEventListener('submit', function(event){
    event.preventDefault();
    let newIceCreamName = event.target.children[1].value
    let ingLiArray = event.target.children[4].children
    let checkedIngIdArray = [];

    for(let i = 0; i < ingLiArray.length; i++){
      if(ingLiArray[i].children[1].checked){
        checkedIngIdArray.push(ingLiArray[i].dataset.id)
      }
    }
    

    let options = {
    method: "POST",
    headers:
      {Accept: 'application/json',
       'Content-Type': 'application/json'},
    body:
      JSON.stringify({
            "name": newIceCreamName,
            "ingredients": checkedIngIdArray
       })
    }

    fetch('http://localhost:3000/ice_creams', options)
      .then(resp=>resp.json())
      .then( data => {

        console.log(data)
        getIceCreams()
      })
  })

  fetch('http://localhost:3000/ingredients')
    .then( resp=> resp.json())
    .then( ingredientsArray => {
      iceCreamCheckboxes.innerHTML = generateIngredientInputs(ingredientsArray)
      ingredientArray = ingredientsArray;

      getIceCreams()
    })

  function getIceCreams(){
    fetch('http://localhost:3000/ice_creams')
    .then(resp=>resp.json())
    .then( iceCreamsArray => {

      iceCreamGrid.innerHTML = generateIceCreamGrid(iceCreamsArray)

      iceCreamArray = iceCreamsArray;
    })
  }

   const generateIngredientInputs = (ingredientArray) => (
    ingredientArray.map(ingObj =>
      `<li id="li-ing-${ingObj.id}" data-id=${ingObj.id}>
      <label for="ing-${ingObj.id}" >${ingObj.name}</label>
      <input id="ing-${ingObj.id}"  type='checkbox'>
      </li>`
    ).join(" ")
  )

  function generateIceCreamCard(iceCreamObj){
    let ingredientListItems = iceCreamObj.ingredients.map( (ingredientId) => {
      var ingredientObj = ingredientArray.find( (ingredient) => ingredient.id == ingredientId);
      return `<li data-ingredientId=${ingredientObj.id}>${ingredientObj.name}</li>`;
    }).join(" ")

    return `<div>
              <h3>${iceCreamObj.name}</h3>
              <img src="icecream.jpeg">
              <ul>
                ${ingredientListItems}
              </ul>
            </div>`
  }

  const generateIceCreamGrid = (iceCreamArray) => (
    iceCreamArray.map( (iceCreamObj) => generateIceCreamCard(iceCreamObj) ).join()
  )






});
