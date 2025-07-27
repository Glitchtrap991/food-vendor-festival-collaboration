// Example: firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAf5I10pd1cj7DSJqyDyvB-nHw_KMQyecg",
  authDomain: "festival-food-finder.firebaseapp.com",
  projectId: "festival-food-finder",
  storageBucket: "festival-food-finder.firebasestorage.app",
  messagingSenderId: "959715262174",
  appId: "1:959715262174:web:6322877f8fd2647a164c4f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
