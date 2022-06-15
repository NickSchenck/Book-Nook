var tbrArray;
var displayArray = [];

let formEl = document.querySelector("#form");
let searchResultEl = document.querySelector("#search-results");
let ListEl = document.querySelector("#TBR-list");

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

window.onload = function() {
    loadTrbArray();
    renderTBRList();
};

/*
#############Event Handlers
*/

function formSubmitHandler(event) {
    let tag = event.target;
    let inputEl = document.querySelector("#input");
    displayArray = [];

    if (tag.id === "submitButton") {
        callApiPromise(inputEl.value);
        inputEl.value = "";
    }

    event.preventDefault();
};

/*
###### TBR ls add
*/

function tbrEventHandler(event) {

    if(event.target.tagName === "BUTTON") {
        event.preventDefault();
        let ListEl = document.querySelector('#TBR-list');
        let bookname = event.target.parentNode.childNodes[0].childNodes[0];
        let drink = event.target.parentNode.parentNode.childNodes[1].childNodes[0].textContent;

        let TBREl = document.createElement('li');

        TBREl.classList = 'card grey darken-1';
        TBREl.textContent = bookname.textContent + '/' + drink;


        ListEl.appendChild(TBREl);

        // add to tbr array
        for(let displayObj of displayArray) {
            if(displayObj.drinkName === drink) {
                tbrArray.push(displayObj);
            }
        }
        

        //delete button
        var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        TBREl.appendChild(deleteButtonEl);

        saveTbrArray();
    }
};

/*
###### Rendering
*/

function renderSearchResults(displayObj) {

    let containerEl = document.createElement("div");
    containerEl.className ="card grey darken-1";
    let bookContainerEl = document.createElement("div");
    bookContainerEl.className ="card-content white-text";
    let drinkContainerEl = document.createElement("div");
    drinkContainerEl.className ="card-content white-text";

    let bookInfoEl = document.createElement("div");
    let bookchoiceEl = document.createElement('button');

    bookchoiceEl.textContent = 'Add Book to To Be Read List';
    bookchoiceEl.setAttribute('class', 'add_book');


    let bookTitleEl = document.createElement("h3");
    bookTitleEl.setAttribute('class', 'book')
    let bookAuthorEl = document.createElement("h4");
    bookAuthorEl.setAttribute('class', "author")
    let bookDescEl = document.createElement("p");
    let bookImg = document.createElement('img');

    let drinkImg = document.createElement('img');
    let drinkNameEl = document.createElement("h3");
    let drinkIngredientsEl = document.createElement("p");
    let drinkMesEl = document.createElement("p");
    let drinkInstructEl = document.createElement("p");

    bookTitleEl.textContent = displayObj.bookTitle;
    bookAuthorEl.textContent = displayObj.bookAuthor;
    bookDescEl.textContent = displayObj.bookDescription;
    bookImg.src = displayObj.bookImageUrl;


    drinkImg.src = displayObj.drinkImageUrl;
    drinkNameEl.textContent = displayObj.drinkName;
    drinkNameEl.setAttribute("class", "drink-name");
    drinkIngredientsEl.textContent = displayObj.drinkIngredients.toString();
    drinkMesEl.textContent = displayObj.drinkMeasurements.toString();
    drinkInstructEl.textContent = displayObj.drinkInstructions;

    bookInfoEl.appendChild(bookTitleEl);
    bookInfoEl.appendChild(bookAuthorEl);
    bookInfoEl.appendChild(bookDescEl);

    drinkContainerEl.appendChild(drinkNameEl);
    drinkContainerEl.appendChild(drinkIngredientsEl);
    drinkContainerEl.appendChild(drinkMesEl);
    drinkContainerEl.appendChild(drinkInstructEl);
    
    bookContainerEl.appendChild(bookInfoEl);
    bookContainerEl.appendChild(bookchoiceEl);

    containerEl.appendChild(bookContainerEl);
    containerEl.appendChild(drinkContainerEl);

    searchResultEl.appendChild(containerEl);
};

function renderTBRList(){
    for(i = 0; i < tbrArray.length; i++){
        let bookname = tbrArray[i].bookTitle;
        let drink = tbrArray[i].drinkName;
        let TBREl = document.createElement('li');
        let deleteButtonEl = document.createElement("button");

        TBREl.classList = 'card grey darken-1';
        TBREl.textContent = bookname + "/" + drink;
        deleteButtonEl.textContent = "Delete";
        TBREl.appendChild(deleteButtonEl);
        
        saveTbrArray();

        ListEl.appendChild(TBREl);
    }
};

function renderTBRItem(event) {
    //targets the clicked item by checking if = to LI
    if(event.target.tagName === "LI"){
        searchResultEl.innerHTML = "";
        //targets the content of the clicked item, and splits it at the given character
        let drink = event.target.textContent.split("/")[1];
        //targets the content of the clicked item, getting rid of the delete button at the end of the li elm
        let drinkName = drink.substr(0, (drink.length - 6));

        for(i = 0; i < tbrArray.length; i++){
            //within the tbr array target a value(drinkName) and check if it is equal to a defining value
            if(tbrArray[i].drinkName === drinkName){
                renderSearchResults(tbrArray[i]);
            }
            
        }
        
    }

    if(event.target.tagName === "BUTTON") {
        let drink = event.target.parentNode.textContent.split("/")[1];
        let drinkName = drink.substr(0, (drink.length - 6));

        event.target.closest('.card').remove();

        for(let i = 0; i < tbrArray.length; i++) {
            if(tbrArray[i].drinkName === drinkName) {
                tbrArray.splice(i, 1);
            }
        }
        saveTbrArray();
     } 
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

    searchResultEl.innerHTML = "";

    try {
        // fetching array of books based on bookTitle search
        let googleResponse = await fetch(googleBooksApi);
        let googleJson = await googleResponse.json();

        // loop through to produce 5 books from google api and fetch random cocktail
        for (let i = 0; i < 5; i++) {
            cocktailDbResponse = await fetch(cocktailDbApi);
            cocktailDbJson = await cocktailDbResponse.json();

            displayArray.push(new cardObj(googleJson.items[i], cocktailDbJson.drinks[0]));
            await renderSearchResults(displayArray[i]);
        }

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
searchResultEl.addEventListener('click', tbrEventHandler);
ListEl.addEventListener("click", renderTBRItem);