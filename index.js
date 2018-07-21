document.addEventListener("DOMContentLoaded", function() {

  let iceCreamForm = document.getElementById('iceCreamForm');
  let iceCreamCheckboxes = document.getElementById('iceCreamCheckboxes');
  let iceCreamGrid = document.getElementById('iceCreamGrid')
  let ingredientArray;
  let iceCreamArray;

  function renderHome(){
    fetchIngredients()
      .then( ingredients => {
        ingredientArray = ingredients
        iceCreamCheckboxes.innerHTML = generateIngredientInputs(ingredientArray)
      })
      .then( () => fetchIceCreams() )
      .then( iceCreams => {
        iceCreamArray = iceCreams
        iceCreamGrid.innerHTML = generateIceCreamGrid(iceCreams)
      })
  }

  function fetchIngredients(){
    return fetch('http://localhost:3000/ingredient')
      .then( resp=> resp.json())
  }

  function fetchIceCreams(){
    return fetch('http://localhost:3000/ice_cream')
    .then(resp=>resp.json())
  }

  function generateIngredientInputs(ingredientArray){
    return ingredientArray.map(ingObj =>
      `<li id="li-ing-${ingObj.id}" data-id=${ingObj.id}>
      <label for="ing-${ingObj.id}" >${ingObj.name}</label>
      <input id="ing-${ingObj.id}" data-id=${ingObj.id}  type='checkbox'>
      </li>`
    ).join(" ")
  }

  function generateIceCreamGrid(iceCreamArray){
    return iceCreamArray.map( iceCreamObj =>
      generateIceCreamCard(iceCreamObj)
    ).join(" ")
  }

  function generateIceCreamCard(iceCreamObj){
    let ingredientListItems = iceCreamObj.ingredients.map( (ingredientId) => {
      var ingredientObj = ingredientArray.find(ingredient => ingredient.id == ingredientId);

      return `<li data-ingredientId=${ingredientObj.id}>${ingredientObj.name}</li>`;

    }).join(" ")

    return `<div data-id="${iceCreamObj.id}">
              <h3>${iceCreamObj.name}</h3>
              <img src="icecream.jpeg">
              <div id="editDeleteButtons">
                <button data-button-type="edit" class="editButton">Edit</button>
                <button data-button-type="delete" class="deleteButton">Delete</button>
              </div>
              <h4>Ingredients:</h4>

              <ul>
                ${ingredientListItems}
              </ul>
            </div>`
  }

  iceCreamForm.addEventListener('submit', (event)=>{ createNewIceCream(event)})

  iceCreamGrid.addEventListener('click', (event)=>{
    let clickedButton = event.target.dataset.buttonType
    console.log(event)

    if(clickedButton == "edit"){
      generateEditForm(event)
    } else if (clickedButton == "submit"){
      submitEdit(event)
    } else if (clickedButton == "delete"){
      deleteIceCream(event)
    }
  })

  function getCheckedValues(ingredientLiChildren){
    let checkedIngIdArray = [];
    for(let i = 0; i < ingredientLiChildren.length; i++){
      if(ingredientLiChildren[i].children[1].checked){
        checkedIngIdArray.push(ingredientLiChildren[i].dataset.id)
      }
    }
    return checkedIngIdArray
  }

  function createNewIceCream(event){
    event.preventDefault();
    let newIceCreamName = event.target.children[1].value
    let checkedIngIdArray = getCheckedValues(event.target.children[4].children)
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
    fetch('http://localhost:3000/ice_cream', options)
      .then(resp=>resp.json())
      .then(()=>{renderHome()})
  }


  function generateEditForm(event){
    let parentNode = event.target.parentElement.parentElement;
    let [title, image, editDeleteButtons, ingredientTitle, ingredients] = parentNode.children;
    let iceCreamId = parentNode.dataset.id
    let iceCreamObj = iceCreamArray.find( icecream => icecream.id == iceCreamId)
    let iceCreamIngredients = iceCreamObj.ingredients
    let ingredientInputs;

    let input = document.createElement('input');
    input.type = 'text';
    input.value = title.innerText;
    parentNode.replaceChild(input, title);

    let submitButton = document.createElement('button')
    submitButton.id = `submitPatch-${iceCreamId}`
    submitButton.innerText = "Submit"
    submitButton.dataset.buttonType = "submit"
    parentNode.replaceChild(submitButton, editDeleteButtons)
    fetchIngredients()
      .then(resp => {
        ingredients.innerHTML = generateIngredientInputs(resp);
        for(let i = 0; i < ingredients.children.length; i++){
          let checkbox = ingredients.children[i].children[1]
          if(iceCreamIngredients.includes(checkbox.dataset.id)){
            checkbox.checked = true
          }
        }
      })
  }

  function submitEdit(event){
    let iceCreamId = event.target.parentElement.dataset.id
    let inputValue = event.target.parentElement.children[0].value
    let checkedValues = getCheckedValues(event.target.parentElement.children[4].children)
    let options = {
      method: "PATCH",
      headers:
        {Accept: 'application/json',
         'Content-Type': 'application/json'},
      body:
        JSON.stringify({
              "name": inputValue,
              "ingredients": checkedValues
         })
    }
    fetch(`http://localhost:3000/ice_cream/${parseInt(iceCreamId)}`, options)
      .then(()=>{renderHome()})
  }

  function deleteIceCream(event){
    let iceCreamId = event.target.parentElement.parentElement.dataset.id
    fetch(`http://localhost:3000/ice_cream/${parseInt(iceCreamId)}`, {method: "DELETE",})
      .then(()=>{renderHome()})
  }

  renderHome()
});
