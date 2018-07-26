console.log("connected!!")
getAllIceCreams()
createIngredientCheckboxes(document.getElementById("iceCreamCheckboxes"))

function getAllIceCreams() {
    fetch("http://localhost:3000/ice_cream")
    .then(resp => resp.json()).then(iceCreams => {
        iceCreams.forEach(iceCream => {
            render(iceCream)
            iceCream.ingredients.forEach(ingredientId => {
                renderIngredient(ingredientId, iceCream.id)
            })
        })
    })
}

function render(iceCream) {
    let iceCreamCard = document.createElement("div")
    iceCreamCard.innerHTML = iceCreamHTML(iceCream)
    iceCreamCard.id = `${iceCream.id}-card`
    document.getElementById("iceCreamGrid").appendChild(iceCreamCard)
}

function iceCreamHTML(iceCream) {
    return `<h3>${iceCream.name}</h3>
    <img src="icecream.jpeg">
    <div id="editDeleteButtons">
      <button id="${iceCream.id}-edit" data-button-type="edit" class="editButton" onclick="editIceCream(${iceCream.id})">Edit</button>
      <button id="${iceCream.id}-delete" data-button-type="delete" class="deleteButton" onclick="deleteIceCream(${iceCream.id})">Delete</button>
    </div>
    <h4>Ingredients:</h4>
    <ul id="${iceCream.id}-ingredients">
    </ul>`
}

function deleteIceCream(id) {
    fetch(`http://localhost:3000/ice_cream/${id}`, {
        method: "DELETE"
    }).then(r => r.json()).then(document.getElementById(`${id}-card`).remove())
}

function renderIngredient(ingredientId, iceCreamId) {
    let ingredientLi = document.createElement("li")
    ingredientLi.dataset.ingredientid=ingredientId
    document.getElementById(`${iceCreamId}-ingredients`).appendChild(ingredientLi)
    getAndRenderIngredientName(ingredientId, ingredientLi)
}

function getAndRenderIngredientName(id, ingredientLi) {
    fetch(`http://localhost:3000/ingredient/${id}`).then(r => r.json())
    .then(ingredient => {
        ingredientLi.innerHTML = ingredient.name
    })
}


function createIngredientCheckboxes(parentNode) {
    fetch("http://localhost:3000/ingredient").then(r => r.json())
    .then(ingredients => {
        ingredients.forEach(ingredient => {
            let li = renderCheckbox(ingredient, "")
            parentNode.appendChild(li)
        })
    })
}

function renderCheckbox(ingredientObj, checked) {
    //checked is either a string of "checked" or ""
    let li = document.createElement("li")
    li.innerHTML = `${ingredientObj.name}<input data-id="${ingredientObj.id}" type="checkbox" value="${ingredientObj.name}" ${checked}>`
    return li
}

function submitNewIceCream(event) {
    event.preventDefault()
    let name = document.getElementById("iceCreamName").value
    let ingredients = []
    document.querySelectorAll('input:checked').forEach(checkbox => {
        ingredients.push(checkbox.dataset.id)
    })
    console.log("submitting following icecream:", name, ingredients)
    fetch("http://localhost:3000/ice_cream", {
        method: "POST",
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify({"name": name, "ingredients": ingredients})
    }).then(r => r.json()).then(icecream => {
        render(icecream)
        ingredients.forEach(ingredientId => {
            renderIngredient(ingredientId, icecream.id)
        })
    }).then(document.querySelector("form").reset())
}

function editIceCream(iceCreamId) {
    //e.preventDefault()
    //console.log(e.target)
    //GET THE ACTUAL CHANGES
    makeNameFieldAppear(iceCreamId)
    makeEditCheckboxesAppear(iceCreamId)
    toggleButtons(iceCreamId)
    //submit putton has not event listener to submit ice creams
    
}

function makeEditCheckboxesAppear(iceCreamId) {
    let parentNode = document.getElementById(`${iceCreamId}-ingredients`)
    let oldListItems = parentNode.innerText
    parentNode.innerHTML = ""
    fetch("http://localhost:3000/ingredient").then(r => r.json())
    .then(ingredients => {
        ingredients.forEach(ingredient => {
            console.log(ingredient)
            let checked = ""
            //debugger;
            if (oldListItems.includes(ingredient.name)) {
                checked = "checked"
            }
            let li = renderCheckbox(ingredient, checked)
            parentNode.appendChild(li)
        })
    })
}

function makeNameFieldAppear(iceCreamId) {
    let header = document.getElementById(`${iceCreamId}-card`).querySelector("h3")
    let headerName = header.innerHTML
    header.innerHTML = `<input value="${headerName}" type="text"></input>`
}

function toggleButtons(iceCreamId) {
    document.getElementById(`${iceCreamId}-card`).querySelector("#editDeleteButtons").innerHTML = ""
    let submit = document.createElement("button")
    submit.innerHTML = `Submit`
    submit.id = `${iceCreamId}-submit`
    document.getElementById(`${iceCreamId}-card`).querySelector("#editDeleteButtons").appendChild(submit)
    submit.addEventListener("click", e => {
        e.preventDefault()
        //function to actually submit
        submitIceCreamEdits(iceCreamId)
    })
}

function submitIceCreamEdits(iceCreamId) {
    let iceCreamCard = document.getElementById(`${iceCreamId}-card`)
    let name = iceCreamCard.querySelector("h3 input").value
    let ingredients = getNewIngredients(iceCreamCard)
    //rerender the current iceCream
    fetch(`http://localhost:3000/ice_cream/${iceCreamId}`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"name": name, "ingredients": ingredients})
    }).then(resp => resp.json()).then(iceCream => {
        iceCreamCard.innerHTML = iceCreamHTML(iceCream)
        iceCreamCard.id = `${iceCream.id}-card`
        iceCream.ingredients.forEach(ingredientId => {
            renderIngredient(ingredientId, iceCream.id)
        })
    })
}

function getNewIngredients(iceCreamCard) {
    let ingredients = []
    iceCreamCard.querySelectorAll('input:checked').forEach(checkbox => {
        ingredients.push(checkbox.dataset.id)
    })
    return ingredients
}

