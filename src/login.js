import { auth, db } from "./firebase.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        window.location.href = "homepage.html";
        // ...
    })
    .catch((error) => {
        alert(error.message);
    });
});

