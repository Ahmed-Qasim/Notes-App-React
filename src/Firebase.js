import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCMi6aLMjiOdYyeWt-BdU6SjsfUIaBfKwY",
    authDomain: "notes-app-ada6e.firebaseapp.com",
    projectId: "notes-app-ada6e",
    storageBucket: "notes-app-ada6e.appspot.com",
    messagingSenderId: "169583576678",
    appId: "1:169583576678:web:4959c4247cf49436208fa7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const noteCollection = collection(db, "notes");
