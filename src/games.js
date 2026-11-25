import { db, auth } from "./firebase.js";
import { collection, getDocs, doc, getDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

let currentUser = null;
let favourites = [];

const gameTemplate = document.getElementById("gameCardTemplate");
const gamesContainer = document.getElementById("games-go-here");

async function toggleFavourite(heart, gameID) {
    const userRef = doc(db, "users", currentUser.uid);

    if (heart.classList.contains("bi-heart-fill")) {
        await setDoc(userRef, {
            favourites: arrayRemove(gameID)
        }, { merge: true });

        heart.classList.replace("bi-heart-fill", "bi-heart");
    } else {
        await setDoc(userRef, {
            favourites: arrayUnion(gameID)
        }, { merge: true });

        heart.classList.replace("bi-heart", "bi-heart-fill");
    }
}

function setupHeart(card, gameID) {
    const heart = card.querySelector(".fav-btn");

    if (favourites.includes(gameID)) {
        heart.classList.replace("bi-heart", "bi-heart-fill");
    }

    heart.addEventListener("click", function () {
        toggleFavourite(heart, gameID);
    });
}

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
        setupHeart(newCard, doc.id);

        gamesContainer.appendChild(newCard);
    });
}

onAuthStateChanged(auth, async function (user) {
    if (!user) {
        location.href = "index.html";
    } else {
        currentUser = user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        favourites = userDoc.data()?.favourites || [];

        displayGames();
    }
});