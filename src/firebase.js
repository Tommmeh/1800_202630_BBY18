// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeSY2HB06u_Aq5YjGpqkeo24z_bL2joAg",
  authDomain: "phshgame.firebaseapp.com",
  projectId: "phshgame",
  storageBucket: "phshgame.firebasestorage.app",
  messagingSenderId: "922364895091",
  appId: "1:922364895091:web:256101da583f89a27e6f06",
  measurementId: "G-XXLJ5CTBMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);