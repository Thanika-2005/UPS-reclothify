// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABNscRIB20SSOdlBYkKkmHSUApptQlGnU",
  authDomain: "reclothify-logistics.firebaseapp.com",
  databaseURL: "https://reclothify-logistics-default-rtdb.firebaseio.com",
  projectId: "reclothify-logistics",
  storageBucket: "reclothify-logistics.firebasestorage.app",
  messagingSenderId: "1030022029004",
  appId: "1:1030022029004:web:9b7bbd93cea980b4e9ec69",
  measurementId: "G-NV3WH01Z1R"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;