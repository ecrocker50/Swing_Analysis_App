import { initializeApp } from 'firebase/app';
import * as database from 'firebase/firestore';

const configureFirebase = (): database.Firestore => {
    console.log("configure");
    const firebaseConfig = {
        apiKey: "AIzaSyAco6QlMVq2XUul6wCGy2vKa2SClWFmo3E",
        authDomain: "swinganalysis-47b58.firebaseapp.com",
        databaseURL: "https://swinganalysis-47b58.firebaseio.com",
        projectId: "swinganalysis-47b58",
        storageBucket: "swinganalysis-47b58.appspot.com",
        messagingSenderId: "982706473211",
        appId: "1:982706473211:web:1003a52463538806f2485e"
    };

    const app = initializeApp(firebaseConfig);

    const firestore = database.initializeFirestore(app, {experimentalForceLongPolling: true});
    
    return firestore
}

export const firestore = configureFirebase();