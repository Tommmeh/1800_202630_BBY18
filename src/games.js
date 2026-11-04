
// List of games
const games = [
    {
        name: "Game 1",
        description: "Description",
        image: "./images/hike1.jpg"
    },
    {
        name: "Game 2",
        description: "Description",
        image: "./images/hike2.jpg"
    },
    {
        name: "Game 3",
        description: "Description",
        image: "./images/hike3.jpg"
    },
    {
    name: "Game 4",
    description: "Description",
    image: "./images/hike1.jpg"
    },
    {

    name: "Game 5",
    description: "Description",
    image: "./images/hike2.jpg"
    },
    {
    name: "Game 6",
    description: "Description",
    image: "./images/hike3.jpg"
    }
];

// Get the game card template
const gameTemplate = document.getElementById("gameCardTemplate");

// Get the place where the cards will appear
const gamesContainer = document.getElementById("games-go-here");

// Display each game
games.forEach(function (game) {

    // Make a copy of the card template
    const newCard = gameTemplate.content.cloneNode(true);

    // Add the game information
    newCard.querySelector(".card-title").textContent = game.name;
    newCard.querySelector(".card-text").textContent = game.description;
    newCard.querySelector(".game-image").src = game.image;

    // Add the card to the page
    gamesContainer.appendChild(newCard);

});
