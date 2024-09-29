// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANnh-g0hKcuZAzx9C-R3LKQh0zSMUAsao",
  authDomain: "files-io-f425f.firebaseapp.com",
  projectId: "files-io-f425f",
  storageBucket: "files-io-f425f.appspot.com",
  messagingSenderId: "1017223955996",
  appId: "1:1017223955996:web:b7d294fb7516f4d04b81d9"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase storage
const storage = getStorage(firebaseApp);

export { storage };