import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXTwmNV6KESaN3zYpTEQy4zaTcakPe-CA",
  authDomain: "ebol-bb9e4.firebaseapp.com",
  projectId: "ebol-bb9e4",
  storageBucket: "ebol-bb9e4.appspot.com",
  messagingSenderId: "143218215453",
  appId: "1:143218215453:web:71ba018949085265ded4f4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
  updateDoc,
  query,
  where,
  provider,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
};
