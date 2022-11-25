// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDQyBvlj-_7EwBIS8g3GjN-82km17cnJA",
  authDomain: "cryptofolio-apps.firebaseapp.com",
  projectId: "cryptofolio-apps",
  storageBucket: "cryptofolio-apps.appspot.com",
  messagingSenderId: "654088733357",
  appId: "1:654088733357:web:fd189f6681877eadac7c24",
  measurementId: "G-3LNYC5P7NM",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);

export const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/auth-callback"
      : "https://cryptofolio.vivekthakur.dev/auth-callback",
  // This must be true.
  handleCodeInApp: true,
};
