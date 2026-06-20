// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqgaq5FLCBB_qlGkZhctpNFRfbVE45eTM",
  authDomain: "musika-hub.firebaseapp.com",
  projectId: "musika-hub",
  storageBucket: "musika-hub.firebasestorage.app",
  messagingSenderId: "905086883667",
  appId: "1:905086883667:web:695f2fdddb64570d4033a6",
  measurementId: "G-BFYS9PD0V3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);