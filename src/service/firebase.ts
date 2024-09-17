// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSQXFq5_fkgePxjeigsNq_qc5yZT4FIR8",
  authDomain: "gerenciador-orcamento-pessoal.firebaseapp.com",
  projectId: "gerenciador-orcamento-pessoal",
  storageBucket: "gerenciador-orcamento-pessoal.appspot.com",
  messagingSenderId: "313537903365",
  appId: "1:313537903365:web:82a299ac780f194ef3556c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
