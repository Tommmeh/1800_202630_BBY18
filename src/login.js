import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";

const form = document.getElementById("login-form");
fform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, user.uid, {merge:true});

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = "homepage.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

