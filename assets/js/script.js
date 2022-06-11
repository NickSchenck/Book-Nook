var tbrArray;
var displayArray = [];

let formEl = document.querySelector("#form");
let searchResultEl = document.querySelector("#search-results");

// object to house book and drink combo info
function cardObj(bookObj, drinkObj) {

    this.bookTitle = bookObj.volumeInfo.title;
    this.bookAuthor = bookObj.volumeInfo.authors[0];
    this.bookDescription = bookObj.volumeInfo.description;
    this.bookImageUrl = bookObj.volumeInfo.imageLinks.thumbnail;
    this.drinkName = drinkObj.strDrink;
    this.drinkImageUrl = drinkObj.strDrinkThumb;
    this.drinkIngredients = getDrinkPropertyArr(drinkObj, "strIngredient");
    this.drinkMeasurements = getDrinkPropertyArr(drinkObj, "strMeasure");
    this.drinkInstructions = drinkObj.strInstructions;
    
}

/*
#############Event Handlers
*/

function formSubmitHandler(event) {
    let tag = event.target;
    let inputEl = document.querySelector(".pure-input-rounded");
    displayArray = [];

    if (tag.id === "submitButton") {
        callApiPromise(inputEl.value);
        inputEl.value = "";
    }

    event.preventDefault();
};

/*
###### Rendering
*/

function renderSearchResults() {
    let containerEl = document.createElement("div");
    let leftContainerEl = document.createElement("div");
    let rightContainerEl = document.createElement("div");

    let bookTitleEl = document.createElement("h3");
    let bookAuthorEl = document.createElement("h4");
    let bookDescEl = document.createElement("p");
    let bookImg= document.createElement('img');

    let drinkImg = document.createElement('img');
    let drinkNameEl = document.createElement("h3");
    let drinkIngredientsEl = document.createElement("p");
    let drinkMesEl = document.createElement("p");
    let drinkInstructEl = document.createElement("p");

    bookTitleEl.textContent = displayArray[0].bookTitle;
    bookAuthorEl.textContent = displayArray[0].bookAuthor;
    bookDescEl.textContent = displayArray[0].bookDescription;
    bookImg.src=displayArray[0].bookImageUrl;
   

    drinkImg.src = displayArray[0].drinkImageUrl;
    drinkNameEl.textContent = displayArray[0].drinkName;
    drinkIngredientsEl.textContent = displayArray[0].drinkIngredients.toString();
    drinkMesEl.textContent = displayArray[0].drinkMeasurements.toString();
    drinkInstructEl.textContent = displayArray[0].drinkInstructions;

    leftContainerEl.appendChild(bookTitleEl);
    leftContainerEl.appendChild(bookAuthorEl);
    leftContainerEl.appendChild(bookDescEl);
    leftContainerEl.appendChild(bookImg);

    rightContainerEl.appendChild(drinkImg)
    rightContainerEl.appendChild(drinkNameEl);
    rightContainerEl.appendChild(drinkIngredientsEl);
    rightContainerEl.appendChild(drinkMesEl);
    rightContainerEl.appendChild(drinkInstructEl);
    drinkNameEl.textContent = displayArray[0].drinkName;
    drinkIngredientsEl.textContent = displayArray[0].drinkIngredients.toString();
    drinkMesEl.textContent = displayArray[0].drinkMeasurements.toString();
    drinkInstructEl.textContent = displayArray[0].drinkInstructions;

    leftContainerEl.appendChild(bookTitleEl);
    leftContainerEl.appendChild(bookAuthorEl);
    leftContainerEl.appendChild(bookDescEl);
    rightContainerEl.appendChild(drinkNameEl);
    rightContainerEl.appendChild(drinkIngredientsEl);
    rightContainerEl.appendChild(drinkMesEl);
    rightContainerEl.appendChild(drinkInstructEl);

    containerEl.appendChild(leftContainerEl);
    containerEl.appendChild(rightContainerEl);

    searchResultEl.appendChild(containerEl);
};

/*
###### API call
*/

// call to fetch information from google books api and cocktail db api
async function callApiPromise(bookTitle) {
    let googleBooksApi = 'https://www.googleapis.com/books/v1/volumes?q=' + bookTitle;
    let cocktailDbApi = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
    let cocktailDbResponse;
    let cocktailDbJson;
    console.log (googleBooksApi)
    try {
        // fetching array of books based on bookTitle search
        let googleResponse = await fetch(googleBooksApi);
        let googleJson = await googleResponse.json();

        // loop through to produce 5 books from google api and fetch random cocktail
        for (let i = 0; i < 5; i++) {
            cocktailDbResponse = await fetch(cocktailDbApi);
            cocktailDbJson = await cocktailDbResponse.json();

            displayArray.push(new cardObj(googleJson.items[i], cocktailDbJson.drinks[0]));
        }

        await renderSearchResults();
    } catch (error) {
        console.log("error in callPromiseApi " + error);
        alert('Do not drink before the search');
    }
};

// used to parse through drink JSON properties for ingredients and measurements
function getDrinkPropertyArr(obj, property) {
    let targetArr = [];
    let index = 1;

    while (obj[property + index] !== null) {
        targetArr.push(obj[property + index]);
        index++;
    }

    return targetArr;
};

/*
###### Local Storge 
*/

// loads tbr array and if undefined initialize array
function loadTrbArray() {
    if (localStorage.getItem("book-nook-tbr")) {
        tbrArray = JSON.parse(localStorage.getItem("book-nook-tbr"));
    }
    if (tbrArray === undefined) {
        tbrArray = [];
    }
};

// saves tbr array via local storage
function saveTbrArray() {
    localStorage.setItem("book-nook-tbr", JSON.stringify(tbrArray));
};

// event listenters
formEl.addEventListener("click", formSubmitHandler);
