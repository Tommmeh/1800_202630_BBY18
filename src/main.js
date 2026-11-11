import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../styles/style.css';

import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "firebase/auth";

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

// Add a Log out button to the nav (only when logged in)
onAuthStateChanged(auth, (user) => {
  const navList = document.querySelector(".nav");
  if (!user || !navList) return;

  // 1. Make the button
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Log out";
  logoutBtn.className = "btn btn-outline-light btn-sm position-absolute top-0 end-0 m-3";

  // 2. Make it log out when clicked
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });

  // 3. Put it right after the <ul>, so it lands top right
  navList.after(logoutBtn);
});