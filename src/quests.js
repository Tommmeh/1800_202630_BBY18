import { db, auth } from "./firebase.js";

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

async function setQuestData() {

    await setDoc(doc(db, "quests", "quest_1"), {
        quest_task: "Win a game",
        reward: "A random fish grows bigger",
        failure: "A random fish starves",
        page: "quiz.html"
    });
    await setDoc(doc(db, "quests", "quest_2"), {
        quest_task: "Score over 80% on a quiz",
        reward: "You get a new fish!",
        failure: "A random fish DIES",
        page: "thisorthat.html"
    });
    await setDoc(doc(db, "quests", "quest_3"), {
        quest_task: "Do a backflip",
        reward: "A random fish changes colour",
        failure: "A random fish becomes blind",
        page: "quiz.html"
    });
    await setDoc(doc(db, "quests", "quest_4"), {
        quest_task: "Win *game name* 3 times",
        reward: "You get a random fish cosmetic",
        failure: "A random fish becomes ugly",
        page: "thisorthat.html"
    });
}


// Seeds the "hikes" collection with initial data if it is empty
async function seedQuests() {

    // Get a reference to the "hikes" collection
    const questsRef = collection(db, "quests");

    // Retrieve all documents currently in the collection
    const querySnapshot = await getDocs(questsRef);

    // If no documents exist, the collection is empty
    if (querySnapshot.empty) {

        console.log("Quests collection is empty. Seeding data...");
        // Call function to insert default hike documents
        await setQuestData();

    } else {
        // If documents already exist, do not reseed
        console.log("Quests collection already contains data. Skipping seed.");
    }
}

// Shuffle the quests randomly
function shuffleQuests(quests) {

    for (let i = quests.length - 1; i > 0; i--) {

        // Pick a random position in the array
        let j = Math.floor(Math.random() * (i + 1));

        // Swap the two quests
        let temp = quests[i];
        quests[i] = quests[j];
        quests[j] = temp;
    }

    return quests;
}

// Generate a random quest set
async function generateQuestSet() {
    const questsCollectionRef = collection(db, "quests");
    const querySnapshot = await getDocs(questsCollectionRef);

    let quests = [];

    querySnapshot.forEach(questDoc => {
        quests.push({
            id: questDoc.id,
            ...questDoc.data()
        });
    });

    quests = shuffleQuests(quests);

    // Randomly choose 1–3 quests
    let numberOfQuests = Math.floor(Math.random() * 3) + 1;

    return quests.slice(0, numberOfQuests);
}


// Get or assign quests for this user
async function getUserQuests(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    const now = Date.now();

    // Check if this user already has active quests
    if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        if (
            userData.assignedQuests &&
            userData.questsExpiresAt &&
            userData.questsExpiresAt > now
        ) {
            console.log("Loading saved quests");
            return userData;
        }
    }

    // Assign a new quest set if none exist or they expired
    console.log("Assigning new quests");

    const newQuests = await generateQuestSet();

    const assignedAt = Date.now();
    const expiresAt = assignedAt + (48 * 60 * 60 * 1000);

    const questData = {
        assignedQuests: newQuests,
        questsAssignedAt: assignedAt,
        questsExpiresAt: expiresAt,
        completedQuests: []
    };

    // Save quest information to the user's existing document
    await setDoc(userRef, questData, { merge: true });

    return questData;
}


// Display saved quests
function displayCardsDynamically(questData) {
    const cardTemplate = document.getElementById("questCardTemplate");
    const questContainer = document.getElementById("quests-go-here");

    questContainer.innerHTML = "";

    questData.assignedQuests.forEach(quest => {
        const newcard = cardTemplate.content.cloneNode(true);

        newcard.querySelector(".card-header").textContent =
            quest.quest_task;

        newcard.querySelector(".card-text").textContent =
            `Reward: ${quest.reward}.`;

        newcard.querySelector(".card-length").textContent =
            `Failure: ${quest.failure}.`;

        if (quest.page) {
            newcard.querySelector("a").href = quest.page;
        }

        questContainer.appendChild(newcard);
    });
}


// Countdown timer based on the saved expiration time
function startQuestTimer(expiresAt) {
    const timerDisplay = document.getElementById("questTimer");

    function updateTimer() {
        let timeLeft = expiresAt - Date.now();

        if (timeLeft <= 0) {
            timerDisplay.textContent = "Quests expired!";
            clearInterval(countdown);
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor(
            (timeLeft % (1000 * 60)) / 1000
        );

        timerDisplay.textContent =
            `Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateTimer();

    const countdown = setInterval(updateTimer, 1000);
}


// Load quests for the logged-in user
async function loadQuests(user) {
    await seedQuests();

    const questData = await getUserQuests(user);

    displayCardsDynamically(questData);

    startQuestTimer(questData.questsExpiresAt);

    console.log("User's saved quests:", questData);
}


// Wait until Firebase knows who is logged in
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        console.log("No user logged in. Quests not loaded.");
        return;
    }

    try {
        await loadQuests(user);
    } catch (error) {
        console.error("Error loading quests:", error);
    }
});



