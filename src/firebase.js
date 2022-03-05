import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUPYlWQ5hpgqy_4C5Ip2_To2z_6GfMINA",
  authDomain: "netflix-build-660cd.firebaseapp.com",
  projectId: "netflix-build-660cd",
  storageBucket: "netflix-build-660cd.appspot.com",
  messagingSenderId: "940358619835",
  appId: "1:940358619835:web:e5a0c10075556aced48f9e"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };
export default db;