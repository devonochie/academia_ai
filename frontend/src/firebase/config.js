import { initializeApp } from "firebase/app";   
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCRkZZ3cG7Z1SpM5_pS-_yPF8d2cc2O1ac",
  authDomain: "academia-3d1c6.firebaseapp.com",
  projectId: "academia-3d1c6",
  storageBucket: "academia-3d1c6.firebasestorage.app",
  messagingSenderId: "1023548030535",
  appId: "1:1023548030535:web:2868450062c3519661fb62",
  measurementId: "G-JQSP2VQTZD"
};

const app = initializeApp(firebaseConfig) 
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export  {
   firebaseConfig,
   app,
   auth,
   db,
   storage
}