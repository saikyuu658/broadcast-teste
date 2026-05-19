import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNMx0a-VfBNin1jI4PFP6j7IQcgBQuzKM",
  authDomain: "broadcast-3a673.firebaseapp.com",
  projectId: "broadcast-3a673",
  storageBucket: "broadcast-3a673.firebasestorage.app",
  messagingSenderId: "259621450633",
  appId: "1:259621450633:web:dba624d794ac3b88a36758"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db}