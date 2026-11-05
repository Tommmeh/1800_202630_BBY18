import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const gameTemplate = document.getElementById("gameCardTemplate");
const gamesContainer = document.getElementById("games-go-here");

async function displayGames() {
    // Get every document in the "games" collection
    const snapshot = await getDocs(collection(db, "games"));

    // Display each game
    snapshot.forEach(function (doc) {
        const game = doc.data();

        const newCard = gameTemplate.content.cloneNode(true);
        newCard.querySelector(".card-title").textContent = game.Name;
        newCard.querySelector(".card-text").textContent = game.Description;
        newCard.querySelector(".game-image").src = game.ImageURL;
        newCard.querySelector("small").textContent = game.Difficulty;

        if (game.Page) {
            newCard.querySelector("a").href = game.Page;
        }

        gamesContainer.appendChild(newCard);
    });
}

displayGames();