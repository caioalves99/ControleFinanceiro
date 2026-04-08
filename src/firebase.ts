import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBX3MlrkyIPo-5LrmS5N_toEoj1JkkqqIE",
  authDomain: "controlefinanceiro-c238a.firebaseapp.com",
  projectId: "controlefinanceiro-c238a",
  storageBucket: "controlefinanceiro-c238a.firebasestorage.app",
  messagingSenderId: "900505056984",
  appId: "1:900505056984:web:87bbd72981f337be3589ad",
  measurementId: "G-7B264262WR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
