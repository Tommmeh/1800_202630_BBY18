import { db, auth } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";


// questions for when you hit a hook (same idea as thisorthat.js)
const rounds = [
  {
    real: "www.paypal.com",
    fake: "www.paypa1.com",
    reason: "The fake uses a 1 instead of an l."
  },
  {
    real: "www.amazon.ca",
    fake: "www.amazon.ca-account-verify.com",
    reason: "Real domains don't have extra subdomains like 'account-verify'."
  },
  {
    real: "learn.bcit.ca",
    fake: "bcit-login.help",
    reason: "BCIT sites end in bcit.ca, not .help."
  },
  {
    real: "www.netflix.com",
    fake: "www.netf1ix.com",
    reason: "The fake uses a 1 instead of an l"
  },
  {
    real: "accounts.google.com",
    fake: "accounts.g00gle.com",
    reason: "The fake uses zeros instead of the letter o."
  },
  {
    real: "www.instagram.com",
    fake: "www.instagram-free-followers.net",
    reason: "Free followers is bait, and the real site is instagram.com."
  },
  {
    real: "www.apple.com",
    fake: "www.apple.com.prize-winner.co",
    reason: "The fake has extra subdomains and a different TLD (.co)."
  }
];

// page elements
const holes = document.querySelectorAll(".hole");
const scoreText = document.getElementById("score-text");
const feedback = document.getElementById("feedback");
const startBtn = document.getElementById("start-btn");
const questionBox = document.getElementById("question-box");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const continueBtn = document.getElementById("continue-btn");

let score = 0;
let gameTimer = null;
let currentThing = ""; // "fish", "hook" or ""
let currentHole = null;
let realSide = "left";
let currentReason = "";
const winScore = 10;


// empty every hole
function clearHoles() {
  holes.forEach((hole) => {
    hole.textContent = "";
  });
  currentThing = "";
  currentHole = null;
}

// pop up a fish or a hook in a random hole
function showSomething() {
  clearHoles();

  const randomIndex = Math.floor(Math.random() * holes.length);
  currentHole = holes[randomIndex];

  // 70% fish, 30% hook
  if (Math.random() < 0.7) {
    currentThing = "fish";
    currentHole.textContent = "🐟";
  } else {
    currentThing = "hook";
    currentHole.textContent = "🪝";
  }
}

function updateScore() {
  scoreText.textContent = `Score: ${score} / ${winScore}`;
}

// clicking a hole
holes.forEach((hole) => {
  hole.addEventListener("click", () => {
    // only the hole with something in it counts
    if (hole !== currentHole || currentThing === "") {
      return;
    }

    if (currentThing === "fish") {
      score++;
      updateScore();
      feedback.textContent = "Got one!";
      feedback.className = "fs-5 text-success";
      clearHoles();

      if (score >= winScore) {
        winGame();
      }
    } else {
      // hit a hook, pause the game and ask a question
      clearInterval(gameTimer);
      clearHoles();
      askQuestion();
    }
  });
});

// show a this or that question
function askQuestion() {
  const round = rounds[Math.floor(Math.random() * rounds.length)];

  // 50% chance to be left or right
  if (Math.random() < 0.5) {
    realSide = "left";
    leftBtn.textContent = round.real;
    rightBtn.textContent = round.fake;
  } else {
    realSide = "right";
    leftBtn.textContent = round.fake;
    rightBtn.textContent = round.real;
  }

  // remember the reason so we can show it after they pick
  currentReason = round.reason;

  feedback.textContent = "";
  leftBtn.disabled = false;
  rightBtn.disabled = false;
  continueBtn.hidden = true;
  questionBox.hidden = false;
}

// player picks a side
function checkAnswer(pickedSide) {
  if (pickedSide === realSide) {
    feedback.textContent = "Safe! " + currentReason;
    feedback.className = "fs-5 text-success";
  } else {
    feedback.textContent = "Hooked! You lose a point. " + currentReason;
    feedback.className = "fs-5 text-danger";
    if (score > 0) {
      score--;
    }
    updateScore();
  }

  leftBtn.disabled = true; // stop double-clicking
  rightBtn.disabled = true;
  continueBtn.hidden = false;
}

leftBtn.addEventListener("click", () => checkAnswer("left"));
rightBtn.addEventListener("click", () => checkAnswer("right"));

// go back to whacking
continueBtn.addEventListener("click", () => {
  questionBox.hidden = true;
  feedback.textContent = "";
  gameTimer = setInterval(showSomething, 1500);
});

// start or play again
startBtn.addEventListener("click", () => {
  score = 0;
  updateScore();
  feedback.textContent = "";
  startBtn.hidden = true;
  questionBox.hidden = true;
  clearInterval(gameTimer);
  gameTimer = setInterval(showSomething, 1500);
});

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

async function winGame() {
  clearInterval(gameTimer);
  clearHoles();
  feedback.textContent = `You win! You caught ${winScore} fish 🎉`;
  feedback.className = "fs-5 text-success";
  startBtn.textContent = "Play again";
  startBtn.hidden = false;
  if (loadedQuests != "No Quest") {
    globalThis.questArray = []
    loadedQuests.forEach((quest) => {
      if (quest.id == "quest_2" && quest.status != "Complete") {
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
          assignedQuests : questArray
        };
      };
    })
    await setDoc(userRef, HungerData, { merge: true });
  }
}


// Load quests for the logged-in user
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
