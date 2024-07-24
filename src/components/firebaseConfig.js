import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDI67dFOAODcL7dmpvhRzXX93_ertJPJ-M",
    authDomain: "eris-app-cc463.firebaseapp.com",
    databaseURL: "https://eris-app-cc463-default-rtdb.firebaseio.com",
    projectId: "eris-app-cc463",
    storageBucket: "eris-app-cc463.appspot.com",
    messagingSenderId: "495460903256",
    appId: "1:495460903256:web:dcb58ce62e84ba614ddd2d",
    measurementId: "G-TD6DC1WJDD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Realtime Database
const database = getDatabase(app);

export { app, auth, database };