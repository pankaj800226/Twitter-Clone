import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDfS3NC3OjN14nVxlshT9uac_vk9UxeC0M",
  authDomain: "twitter-clone-b5405.firebaseapp.com",
  projectId: "twitter-clone-b5405",
  storageBucket: "twitter-clone-b5405.appspot.com",
  messagingSenderId: "595411356922",
  appId: "1:595411356922:web:bb32e13942b4bd75528d43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
