var tbrArray;
var displayArray = [];

let formEl = document.querySelector("#form");

// object to house book and drink combo info
function cardObj(bookObj, drinkObj) {

    this.bookTitle = bookObj.volumeInfo.title;
    this.bookAuthor = bookObj.volumeInfo.authors[0];
    this.bookDescription = bookObj.volumeInfo.description;
    this.bookImageUrl = bookObj.volumeInfo.imageLinks.tumbnail;
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
    
    if(tag.id === "submitButton") {
        callApiPromise(inputEl.value);
        console.log(displayArray);
        inputEl.value = "";
    }

    event.preventDefault();
}


// call to fetch information from google books api and cocktail db api
async function callApiPromise(bookTitle) {
    let googleBooksApi = 'https://www.googleapis.com/books/v1/volumes?q=' + bookTitle;
    let cocktailDbApi = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
    let cocktailDbResponse;
    let cocktailDbJson;

    try {
        // fetching array of books based on bookTitle search
        let googleResponse = await fetch(googleBooksApi);
        let googleJson = await googleResponse.json();

        // loop through to produce 5 books from google api and fetch random cocktail
        for(let i = 0; i < 5; i++) {
            cocktailDbResponse = await fetch(cocktailDbApi);
            cocktailDbJson = await cocktailDbResponse.json();
            
            displayArray.push(new cardObj(googleJson.items[i], cocktailDbJson.drinks[0]));
        }
    } catch(error) {
        console.log("error in callPromiseApi " + error);
    }
};

// used to parse through drink JSON properties for ingredients and measurements
function getDrinkPropertyArr(obj, property) {
    let targetArr = [];
    let index = 1;

    while(obj[property + index] !== null) {
        targetArr.push(obj[property + index]);
        index++;
    }

    return targetArr;
};

// loads tbr array and if undefined initialize array
function loadTrbArray() {
    if(localStorage.getItem("book-nook-tbr")) {
        tbrArray = JSON.parse(localStorage.getItem("book-nook-tbr"));
    } 
    if(tbrArray === undefined) {
        tbrArray = [];
    }
};

// saves tbr array via local storage
function saveTbrArray() {
    localStorage.setItem("book-nook-tbr", JSON.stringify(tbrArray));
};

// event listenters
formEl.addEventListener("click", formSubmitHandler);
