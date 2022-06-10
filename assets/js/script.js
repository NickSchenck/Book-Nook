/*
http://api-doc.axesso.de/
https://openlibrary.org/developers/api
*/

let apiurl = 'https://www.googleapis.com/books/v1/volumes?q=lord+of+the+rings';

fetch(apiurl)
    .then(function(reponse) {
        return reponse.json();
    })
    .then(function(data) {
        console.log(data);
        return fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    })
    .then(function(reponse) {
        console.log(reponse.json());
    })
    // .then(function(data) {
    //     console.log(data);
    //     console.log("help");
    // })