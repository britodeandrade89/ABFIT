import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_C_yn_RyBSopY7Tb9aqLW8",
  authDomain: "chaveunica-225e0.firebaseapp.com",
  projectId: "chaveunica-225e0",
  storageBucket: "chaveunica-225e0.firebasestorage.app",
  messagingSenderId: "324211037832",
  appId: "1:324211037832:web:362a46e6446ea37b85b13d",
  measurementId: "G-MRBDJC3QXZ"
};

let app;
let analytics = null;

try {
  app = initializeApp(firebaseConfig);

  // Initialize analytics conditionally and safely to prevent crashes
  isSupported().then((supported) => {
    if (supported && app) {
      try {
        // Prevent initialization with the known invalid key to avoid "400 INVALID_ARGUMENT" console errors.
        // In a production environment, you would replace the apiKey with a valid one.
        if (firebaseConfig.apiKey !== "AIzaSyD_C_yn_RyBSopY7Tb9aqLW8") {
            analytics = getAnalytics(app);
        } else {
            console.log("Firebase Analytics disabled: Placeholder API Key detected.");
        }
      } catch (e) {
        console.warn("Firebase Analytics initialization failed:", e);
      }
    }
  }).catch((err) => {
    console.warn("Firebase Analytics support check failed:", err);
  });
} catch (error) {
  console.warn("Firebase initialization failed. App running in offline/local mode.", error);
}

export { app, analytics };