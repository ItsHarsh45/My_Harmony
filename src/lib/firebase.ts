import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCR1UV4jDO4-1HYFr1nVMmcVO8uO3L-Lls",
  authDomain: "fir-auth-c74da.firebaseapp.com",
  projectId: "fir-auth-c74da",
  storageBucket: "fir-auth-c74da.firebasestorage.app",
  messagingSenderId: "14287055275",
  appId: "1:14287055275:web:72c49aea6be619f04b4aee",
  measurementId: "G-ZXVWZM0ZGE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);