// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjKfU_2TAdd5GnsiE-TLo0h0wBCd6JdG0",
  authDomain: "fcu-yc-passport.firebaseapp.com",
  projectId: "fcu-yc-passport",
  storageBucket: "fcu-yc-passport.appspot.com",
  messagingSenderId: "696873464145",
  appId: "1:696873464145:web:e440f29b20b2539c976370",
  measurementId: "G-PSRVBSEZ9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);