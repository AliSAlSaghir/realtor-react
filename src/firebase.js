import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyVWYIKGis2Tmf54d-X2Re9e0rwyec1tQ",
  authDomain: "realtor-react-c69b5.firebaseapp.com",
  projectId: "realtor-react-c69b5",
  storageBucket: "realtor-react-c69b5.appspot.com",
  messagingSenderId: "297397418803",
  appId: "1:297397418803:web:a549ff9a04bb67518e9c46",
};

initializeApp(firebaseConfig);
export const db = getFirestore();
