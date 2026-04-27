// assets/js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4Cjj6tFDZ-W2j4mkMfXAvZiuMvg5qNhQ",
  authDomain: "pinnacle-realty-4e70e.firebaseapp.com",
  projectId: "pinnacle-realty-4e70e",
  storageBucket: "pinnacle-realty-4e70e.firebasestorage.app",
  messagingSenderId: "508957405843",
  appId: "1:508957405843:web:2484505b841705dd0b1366"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);