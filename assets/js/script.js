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

window.onload = function() {
    loadTrbArray();
};

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
###### TBR ls add
*/

function tbrEventHandler(event) {

    if(event.target.tagName === "BUTTON") {
        event.preventDefault();
        let ListEl = document.querySelector('#TBR-list');
        let bookname = event.target.parentNode.childNodes[0].childNodes[0];
        let author = event.target.parentNode.childNodes[0].childNodes[1];
        let drink = event.target.parentNode.parentNode.childNodes[1].childNodes[0].textContent;

        console.log(drink);

        let TBREl = document.createElement('li');
        TBREl.classList.add('pure-menu-item');
        TBREl.textContent = bookname.textContent + ' by ' + author.textContent;

        ListEl.appendChild(TBREl);

        // add to tbr array
        for(let displayObj of displayArray) {
            console.log(displayObj);
            if(displayObj.drinkName === drink) {
                console.log("help");
                tbrArray.push(displayObj);
            }
        }
        

        //delete button
        var deleteButtonEl = document.createElement("button");
        deleteButtonEl.textContent = "Delete";
        TBREl.appendChild(deleteButtonEl);


        ListEl.addEventListener('click',function(event){
            if(event.target.tagName === "BUTTON") {
                event.target.closest('.pure-menu-item').remove();

                // removes from tbr array
                for(let i = 0; i < tbrArray.length; i++) {
                    if(tbrArray[i].drinkName === drink.textContent) {
                        tbrArray.splice(i, 1);
                    }
                }
                saveTbrArray();
            }
        });

        saveTbrArray();
    }
};

/*
###### Rendering
*/

function renderSearchResults(displayObj) {

    let containerEl = document.createElement("div");
    let bookContainerEl = document.createElement("div");
    let drinkContainerEl = document.createElement("div");

    let bookInfoEl = document.createElement("div");
    let bookchoiceEl = document.createElement('button');

    bookchoiceEl.textContent = 'TBR ?';
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
    //bookInfoEl.appendChild(bookImg);


    //drinkContainerEl.appendChild(drinkImg);
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

