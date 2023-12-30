// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyComUN0iZGQUwgj6sq7KDXEoMjTJpMGj9g",
  authDomain: "test-project-20be8.firebaseapp.com",
  projectId: "test-project-20be8",
  storageBucket: "test-project-20be8.appspot.com",
  messagingSenderId: "767452797111",
  appId: "1:767452797111:web:d88e315bce0f54d3101532",
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app)
