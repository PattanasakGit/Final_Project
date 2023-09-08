import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAG8a2dcJiYJxbsjdo5QlDInhtTgrc3cks",
  authDomain: "yakkai.firebaseapp.com",
  projectId: "yakkai",
  storageBucket: "yakkai.appspot.com",
  messagingSenderId: "250125819918",
  appId: "1:250125819918:web:9d754d8d9aa1cc32eadc5f",
  measurementId: "G-02Y7ZYR7Z2"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);