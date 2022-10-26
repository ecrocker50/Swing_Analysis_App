
// import * as firebase from '@react-native-firebase/app';
// import firestore from '@react-native-firebase/firestore';
import { initializeApp } from 'firebase/app';
import * as database from 'firebase/firestore';
import 'firebase/firestore';

const configureFirebase = (): database.Firestore => {
    // console.ignoredYellowBox = ['Setting a timer'];
    // if (!global.btoa) {
    //     global.btoa = encode;
    // }
    
    // if (!global.atob) {
    //     global.atob = decode;
    // }
    
    // Your web app's Firebase configuration
    const firebaseConfig2 = {
        apiKey: "AIzaSyCWVzh6NbyGYwoOn2utATGHyfWDlUVuJl0",
        authDomain: "arm-it2-97e8f.firebaseapp.com",
        databaseURL: "https://arm-it2-97e8f.firebaseio.com",
        projectId: "arm-it2-97e8f",
        storageBucket: "arm-it2-97e8f.appspot.com",
        messagingSenderId: "63166736175",
        appId: "1:63166736175:web:5e9e0f180e5991612c63da"
        /*
        const firebaseConfig = {
            apiKey: "AIzaSyAco6QlMVq2XUul6wCGy2vKa2SClWFmo3E",
            authDomain: "swinganalysis-47b58.firebaseapp.com",
            projectId: "swinganalysis-47b58",
            storageBucket: "swinganalysis-47b58.appspot.com",
            messagingSenderId: "982706473211",
            appId: "1:982706473211:web:1003a52463538806f2485e"
        };
        apiKey: "AIzaSyCgvPpda6oyupCClMdmFNiisjHI3RPIiZI",
        authDomain: "securitysystemapp-ff04b.firebaseapp.com",
        databaseURL: "https://securitysystemapp-ff04b.firebaseio.com",
        projectId: "securitysystemapp-ff04b",
        storageBucket: "securitysystemapp-ff04b.appspot.com",
        messagingSenderId: "1096150681634",
        appId: "1:1096150681634:web:1b309d7e36dcf44fce627b",
        measurementId: "G-NM1MR0TE7P"
        */
      };

    const firebaseConfig = {
        apiKey: "AIzaSyAco6QlMVq2XUul6wCGy2vKa2SClWFmo3E",
        authDomain: "swinganalysis-47b58.firebaseapp.com",
        databaseURL: "https://swinganalysis-47b58.firebaseio.com",
        projectId: "swinganalysis-47b58",
        storageBucket: "swinganalysis-47b58.appspot.com",
        messagingSenderId: "982706473211",
        appId: "1:982706473211:web:1003a52463538806f2485e"
    };
    
    
    // Initialize Firebase
    // if (firebase.apps.length === 0) {

    const app = initializeApp(firebaseConfig);

    // const firestor = database.getFirestore(app);

    const firestore = database.initializeFirestore(app, {experimentalForceLongPolling: true});
    // }
    //firebase.analytics();

    //global.firebaseObj = firebaseConfig;
    return firestore
}

export const firestore = configureFirebase();