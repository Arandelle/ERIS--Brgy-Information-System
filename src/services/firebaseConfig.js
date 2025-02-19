import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import {getStorage} from "firebase/storage"
  
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey:  import.meta.env.VITE_API_KEY,
    authDomain:  import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL:  import.meta.env.VITE_DATABASE_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket:  import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId:  import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId:  import.meta.env.VITE_APP_ID,
    measurementId:  import.meta.env.VITE_MEASUREMENT_ID,
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase storage
const storage = getStorage(app)

export { app, auth, database, storage};