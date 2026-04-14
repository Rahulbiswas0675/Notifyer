import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6YhGsA1K1taKIvgv0th-S6DwaSIDT4GE",
  authDomain: "think-big-f8c31.firebaseapp.com",
  databaseURL: "https://think-big-f8c31-default-rtdb.firebaseio.com",
  projectId: "think-big-f8c31",
  storageBucket: "think-big-f8c31.firebasestorage.app",
  messagingSenderId: "85344977465",
  appId: "1:85344977465:web:6f6a8378893b8075e9c3e8",
  measurementId: "G-G5BKY01KT9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
