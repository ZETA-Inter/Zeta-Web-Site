import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYQieVfuovYDfSo4FfJqTPe9oCyLnVV9Q",
  authDomain: "dbzetamobile.firebaseapp.com",
  projectId: "dbzetamobile",
  storageBucket: "dbzetamobile.firebasestorage.app",
  messagingSenderId: "34722684785",
  appId: "1:34722684785:web:74747644e69644465b60d0",
  measurementId: "G-YJLSQ7G59F"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};