// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
import { getCLS } from "web-vitals";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArOSp887YkWx2o11Ae5aLDow1HekfX2mc",
  authDomain: "testproject-a3c73.firebaseapp.com",
  projectId: "testproject-a3c73",
  storageBucket: "testproject-a3c73.appspot.com",
  messagingSenderId: "212857375617",
  appId: "1:212857375617:web:7a5f0b0c7a7373c388f680"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);