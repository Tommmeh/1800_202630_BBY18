import { db, auth } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

const gameTemplate = document.getElementById("gameCardTemplate");
const gamesContainer = document.getElementById("games-go-here");

function onAuthReady(callback) {
    return onAuthStateChanged(auth, callback);
}

onAuthReady(function (user) {
    if (!user) {
        location.href = "index.html";   // Not logged in → go away
        return;
    }
});


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
        newCard.querySelector(".game_button").textContent = game.Button;

        if (game.Page) {
            newCard.querySelector("a").href = game.Page;
        }

        gamesContainer.appendChild(newCard);
    });
}

displayGames();