import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../styles/style.css';

import { db, auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "firebase/auth";







onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  // Display the user's name
  const heading = document.getElementById("welcome-heading");

  if (heading) {
    const username = user.displayName || user.email.split("@")[0];
    heading.textContent = `Hello, ${username}!`;
  }

});
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc
} from "firebase/firestore";

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

globalThis.PosX = 0
globalThis.PosY = 0
globalThis.fishDirection = "Right"

setInterval(fishInterval, 5000);

function fishInterval() {
  const prevPosX = PosX
  const prevPosY = PosY
  PosX = getRandomInt(0, 92)
  PosY = getRandomInt(0, 92)
  if (PosX < prevPosX) {
    if (fishDirection == "Right") {
      fishDirection = "Left"
      document.getElementById("fish").classList.toggle('flipped');
    }
  }
  else {
    if (fishDirection == "Left") {
      fishDirection = "Right"
      document.getElementById("fish").classList.toggle('flipped');
    }
  }
  document.getElementById("fish").animate(
    [
      { // from parameters
        left: prevPosX + "%",   // you can set this dynamically
        top: prevPosY + "%"    // you can set this dynamically
      },
      { // to parameters
        left: PosX + "%", // you can set this dynamically
        top: PosY + "%"  // you can set this dynamically
      }
    ],
    {
      duration: 5000,
      iterations: Infinity
    }
  );

}
const prevPosX = PosX
const prevPosY = PosY
PosX = getRandomInt(0, 92)
PosY = getRandomInt(0, 92)
if (PosX < prevPosX) {
  if (fishDirection == "Right") {
    fishDirection = "Left"
    document.getElementById("fish").classList.toggle('flipped');
    console.log("left");
  }
}
else {
  if (fishDirection == "Left") {
    fishDirection = "Right"
    document.getElementById("fish").classList.toggle('flipped');
    console.log("right");
  }
}
document.getElementById("fish").animate(
  [
    { // from parameters
      left: prevPosX + "%",   // you can set this dynamically
      top: prevPosY + "%"    // you can set this dynamically
    },
    { // to parameters
      left: PosX + "%", // you can set this dynamically
      top: PosY + "%"  // you can set this dynamically
    }
  ],
  {
    duration: 5000,
    iterations: Infinity
  }
);



// Get or assign hunger for this user
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

  // Assign a new Hunger set if none exist or they expired
  console.log("Assigning new Hunger");

  const assignedAt = Date.now();
  const expiresAt = assignedAt + (48 * 60 * 60 * 1000);

  const HungerData = {
    HungerAssignedAt: assignedAt,
    HungerExpiresAt: expiresAt,
  };

  // Save quest information to the user's existing document
  await setDoc(userRef, HungerData, { merge: true });

  return HungerData;
}





// Countdown timer based on the saved expiration time
function startHunger(expiresAt, assignedAt) {
  const HungerBar = document.getElementById("HungerBar");
  const FishAge = document.getElementById("FishAge")

  function updateHunger() {
    let timeLeft = expiresAt - Date.now();

    if (timeLeft <= 0) {
      console.log("Your fish starved.")
      clearInterval(countdown);
      return;
    }
    let BarWidth = Math.floor((Date.now() / expiresAt) * 100);
    HungerBar.style.width = BarWidth + "%";
    let Age = (Date.now() - assignedAt)
    const days = Math.floor(Age / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (Age % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (Age % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (Age % (1000 * 60)) / 1000
    );

    FishAge.textContent =
      `Age: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  updateHunger();

  const countdown = setInterval(updateHunger, 1000);
}


// Load Hunger for the logged-in user
async function loadHunger(user) {

  const HungerData = await getUserHunger(user);
  startHunger(HungerData.HungerExpiresAt, HungerData.HungerAssignedAt);
}





// Wait until Firebase knows who is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.log("No user logged in. Hunger not loaded.");
    return;
  }

  try {
    await loadHunger(user);
  } catch (error) {
    console.error("Error loading Hunger:", error);
  }
});


// Add a Log out button to the nav (only when logged in)
onAuthStateChanged(auth, (user) => {
  const navList = document.querySelector(".nav");
  if (!user || !navList) return;

  // 1. Make the button
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Log out";
  logoutBtn.className = "btn phsh-logout position-absolute top-0 end-0 m-3";
  // 2. Make it log out when clicked
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });

  // 3. Put it right after the <ul>, so it lands top right
  navList.after(logoutBtn);
});