# 🎉 Festival Food Finder

A web app to explore and contribute street food spots by festival, dish, and vendor — complete with geolocation and Firebase integration.

## 🌟 Features
- 🔍 Search street foods
- 📍 Map view with nearby vendor pins
- 🎊 Filter by festival and dish
- 🏪 Add local vendors with food types
- 🔐 Admin panel with Google Auth (email-restricted)
- 📱 Mobile responsive with Bootstrap

## 🚀 Technologies Used
- HTML, CSS (Bootstrap enhanced), JavaScript
- Firebase Firestore + Auth
- Leaflet.js (map integration)

## 🧪 Try it Out
1. Select a festival → see its dishes.
2. Pick a dish → view local vendors (or add your own).
3. Vendors appear on the map and list.

## 🔐 Admin Panel
Only pre-approved emails can delete food items via the `admin.html` panel.

## 🛠 Setup Instructions
1. Create a Firebase project.
2. Add your credentials in a file called `firebase-config.js`:
```js
// firebase-config.js
import { initializeApp } from \"firebase/app\";
import { getFirestore } from \"firebase/firestore\";
import { getAuth, GoogleAuthProvider } from \"firebase/auth\";

const firebaseConfig = {
  apiKey: \"YOUR_API_KEY\",
  authDomain: \"...\",
  projectId: \"...\",
  ...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
```
3. Open index.html in your browser.
