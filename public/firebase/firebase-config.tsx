import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "@firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBCoFFfdJOcym5ozapvyoMU1eiGqfvV4FA",
  authDomain: "mangastore-4146a.firebaseapp.com",
  databaseURL: "https://mangastore-4146a-default-rtdb.firebaseio.com",
  projectId: "mangastore-4146a",
  storageBucket: "mangastore-4146a.appspot.com",
  messagingSenderId: "245933254179",
  appId: "1:245933254179:web:88201b464db27bd4bab396",
  measurementId: "G-M306YL1MJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getStorage(app)