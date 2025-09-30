// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQvER0lEoumBlD9dOlW0BuTd21XbM_8E8",
  authDomain: "aidetection-dccf0.firebaseapp.com",
  projectId: "aidetection-dccf0",
  storageBucket: "aidetection-dccf0.appspot.com",
  messagingSenderId: "462262254283",
  appId: "1:462262254283:web:e6254afcf7e6c650d5f94e",
  measurementId: "G-1M9F2VKVXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 