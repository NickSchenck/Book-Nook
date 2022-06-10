var historyArray;
var displayArray = [];

// object to house book and drink combo info
function cardObj(bookObj, drinkObj) {
    // TODO: assign data from bookJSONObj and drinkJSONObj

}


async function callApiPromise(bookTitle) {
    let googleBooksApi = 'https://www.googleapis.com/books/v1/volumes?q=' + bookTitle;
    let cocktailDbApi = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
    let cocktailDbResponse;
    let cocktailDbJson;

    // fetching array of books based on bookTitle search
    let googleResponse = await fetch(googleBooksApi);
    let googleJson = await googleResponse.json();

    // loop through to produce 5 books from google api and fetch random cocktail
    for(let i = 0; i < 5; i++) {
        console.log(googleJson);
        cocktailDbResponse = await fetch(cocktailDbApi);
        cocktailDbJson = await cocktailDbResponse.json();
        console.log(cocktailDbJson);
    }
}
