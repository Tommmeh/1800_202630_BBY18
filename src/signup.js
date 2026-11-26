import { auth } from "./firebase.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const form = document.getElementById("signup-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        window.location.href = "homepage.html";
        // ...
    })
    .catch((error) => {
        alert(error.message);
        // ..
    });
});

