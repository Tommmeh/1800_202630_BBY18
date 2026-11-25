
import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "firebase/auth";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs
} from "firebase/firestore";

// Fields stored in Firestore
const fields = ["name", "country", "school", "bio"];
const favouriteGamesContainer = document.getElementById("favourite-games-go-here");
const favouriteGameTemplate = document.getElementById("favouriteGameCardTemplate");

let currentUser = null;

// Check if user is logged in
onAuthStateChanged(auth, async function (user) {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    // Get user's Firestore document
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    const data = userDoc.exists() ? userDoc.data() : {};
    const favourites = data.favourites || [];

    displayFavouriteGames(favourites);

    // Display profile information
    showHeader(
        data.name || user.displayName || user.email,
        user.email
    );

    // Fill in existing profile information
    fields.forEach(field => {
        document.getElementById(field + "Input").value =
            data[field] || "";
    });

});

// Display name, email and avatar
function showHeader(name, email) {

    document.getElementById("avatar").textContent =
        name.charAt(0).toUpperCase();

    document.getElementById("profileName").textContent = name;

    document.getElementById("profileEmail").textContent = email;
}


// EDIT BUTTON
function enableEdit() {

    fields.forEach(field => {
        document.getElementById(field + "Input").disabled = false;
    });

    document.getElementById("saveBtn").disabled = false;

    document.getElementById("nameInput").focus();
}

document.getElementById("editBtn").addEventListener("click", enableEdit);


// SAVE BUTTON
async function saveProfile(event) {

    event.preventDefault();

    const updates = {};

    fields.forEach(field => {
        updates[field] =
            document.getElementById(field + "Input").value;
    });

    try {

        // Save profile information in Firestore
        await setDoc(
            doc(db, "users", currentUser.uid),
            updates,
            { merge: true }
        );

        // Lock inputs again
        fields.forEach(field => {
            document.getElementById(field + "Input").disabled = true;
        });

        document.getElementById("saveBtn").disabled = true;

        // Refresh profile header
        showHeader(updates.name || currentUser.email, currentUser.email);

        // Show confirmation
        const alertBox = document.getElementById("profileAlert");

        alertBox.textContent = "Profile saved successfully!";

        alertBox.classList.remove("d-none");

    } catch (error) {

        alert("Error saving profile: " + error.message);

    }
}
async function displayFavouriteGames(favourites) {
    const snapshot = await getDocs(collection(db, "games"));

    snapshot.forEach(function (doc) {
        if (favourites.includes(doc.id)) {
            const game = doc.data();

            const newCard = favouriteGameTemplate.content.cloneNode(true);

            newCard.querySelector(".card-title").textContent = game.Name;
            newCard.querySelector(".card-text").textContent = game.Description;
            newCard.querySelector(".game-image").src = game.ImageURL;
            newCard.querySelector(".game_button").textContent = game.Button;

            if (game.Page) {
                newCard.querySelector("a").href = game.Page;
            }

            favouriteGamesContainer.appendChild(newCard);
        }
    });
}
document.getElementById("profileForm").addEventListener("submit", saveProfile);
