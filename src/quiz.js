import { db, auth } from "./firebase.js";

import {
    collection,
    doc,
    getDoc,
    addDoc,
    setDoc
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

let currentUser = null;

function onAuthReady(callback) {
    return onAuthStateChanged(auth, callback);
}

onAuthReady(function (user) {
    if (!user) {
        location.href = "index.html";   // Not logged in → go away
        return;
    }
    currentUser = user;                 // Logged in → remember them
});



// ---- (1) What to do when the form is submitted ----
async function newScore() {

    // 1. Collect the form values into ONE object (this becomes the Firestore document)
    const newScore = {
        score: score,
        owner: currentUser.uid,
        ownerName: currentUser.displayName || currentUser.email
    };

    // 2. Save it to the "users" collection
    try {
        await addDoc(collection(db, "users"), newScore);
    } catch (error) {
        alert(`Error saving score:\n${error.code || ""}\n${error.message || error}`);
    }

}

const questions = [
    {
        question: "You receive an email asking you to verify your account through an unfamiliar link. What should you do?",
        answers: [
            "Click the link immediately",
            "Verify the email through the official website",
            "Reply with your password"
        ],
        correct: 1,
        explanation: "Good choice! Visit the official website directly instead of trusting an unfamiliar link."
    },
    {
        question: "Which can be a warning sign of a phishing email?",
        answers: [
            "A suspicious link and urgent request for information",
            "A message you were expecting from a known contact",
            "An email with information you already verified"
        ],
        correct: 0,
        explanation: "Suspicious links and pressure to act quickly can be signs of phishing."
    },
    {
        question: "What should you do if you suspect a message is phishing?",
        answers: [
            "Open every attachment to check it",
            "Forward it to all your friends",
            "Avoid its links and report it through the appropriate channel"
        ],
        correct: 2,
        explanation: "Avoid interacting with suspicious messages and report them through an appropriate channel."
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question");
const answerOptions = document.getElementById("answer-options");
const feedback = document.getElementById("feedback");
const submitButton = document.getElementById("submit-button");
const nextButton = document.getElementById("next-button");
const finalScore = document.getElementById("final-score");

function displayQuestion() {
    const item = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;
    questionText.textContent = item.question;
    feedback.textContent = "";
    finalScore.textContent = "";
    answered = false;

    answerOptions.innerHTML = "";

    item.answers.forEach((answer, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "form-check border rounded p-3 mb-2";

        const input = document.createElement("input");
        input.className = "form-check-input ms-0 me-2";
        input.type = "radio";
        input.name = "answer";
        input.id = `answer-${index}`;
        input.value = index;

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = input.id;
        label.textContent = answer;

        wrapper.append(input, label);
        answerOptions.appendChild(wrapper);
    });

    submitButton.hidden = false;
    submitButton.disabled = false;
    nextButton.hidden = true;
    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "See Results"
            : "Next Question";
}

submitButton.addEventListener("click", function () {
    if (answered) return;

    const selected = document.querySelector(
        'input[name="answer"]:checked'
    );

    if (!selected) {
        feedback.textContent = "Please select an answer first.";
        feedback.className = "mt-3 text-danger";
        return;
    }

    answered = true;
    const item = questions[currentQuestion];
    const isCorrect = Number(selected.value) === item.correct;

    if (isCorrect) {
        score++;
        feedback.textContent = "Correct! " + item.explanation;
        feedback.className = "mt-3 text-success";
    } else {
        feedback.textContent = "Not quite. " + item.explanation;
        feedback.className = "mt-3 text-danger";
    }

    submitButton.hidden = true;
    nextButton.hidden = false;
});


nextButton.addEventListener("click", function () {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        questionNumber.textContent = "Quiz complete!";
        questionText.textContent = "You've finished the Phishing Quiz.";
        answerOptions.innerHTML = "";
        feedback.textContent = "";
        submitButton.hidden = true;
        nextButton.hidden = true;
        finalScore.textContent =
            `Your score: ${score} out of ${questions.length}`;
        if (score == questions.length) { completeQuest() }
        newScore();
    }
});

displayQuestion();

// ---- (2) Connect it: "form, when you are submitted, run saveScore" ----

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
            return userData.assignedQuests;
        }
    }
    // Save quest information to the user's existing document
    await setDoc(userRef, questData, { merge: true });
    return ("No Quest")
}

async function getUserHunger(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    const now = Date.now();

    // Check if this user already has hunger
    if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        if (
            userData.HungerExpiresAt &&
            userData.HungerExpiresAt > now
        ) {
            console.log("Loading saved hunger");
            return userData;
        }
    }
}

async function completeQuest() {
    if (loadedQuests != "No Quest") {
        globalThis.questArray = []
        loadedQuests.forEach((quest) => {
            if (quest.id == "quest_1" && quest.status != "Complete") {
                let questData = quest
                questData.status = "Complete"
                questArray.push(questData)

                let expiresAt = UserData.HungerExpiresAt
                let FoodAmount = (48 * 60 * 60 * 1000);

                if (expiresAt + FoodAmount >= (Date.now() + (48 * 60 * 60 * 1000))) { expiresAt = Date.now() + (48 * 60 * 60 * 1000) }
                else { expiresAt = expiresAt + FoodAmount }
                HungerData = {
                    HungerAssignedAt: UserData.HungerAssignedAt,
                    HungerExpiresAt: expiresAt,
                    assignedQuests: questArray
                };
            };
        })
        await setDoc(userRef, HungerData, { merge: true });
    }
}

async function loadQuests(user) {

    globalThis.loadedQuests = await getUserQuests(user);
    globalThis.userRef = doc(db, "users", user.uid);
    globalThis.UserData = await getUserHunger(user)
    globalThis.HungerData = UserData
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