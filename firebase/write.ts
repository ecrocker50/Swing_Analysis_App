import * as database from 'firebase/firestore';
import { SingleSession, UserSessionsData } from '../types';
import { firestore } from '../firebase/firebaseInstance';



export const setDatabase = async (userData: UserSessionsData) => {
    // Get the Firestore collection reference
    const collectionRef = database.collection(firestore, "user1");

    // Get the document reference that we will use as our target to write to
    const docRefToWriteTo = database.doc(firestore, "user1", "swingData");

    // Format the userData to be able to be pushed to firebase
    const formattedUserData = {"userSessions": userData};

    // Set the session document, called 'swingData' to collection 'user1'. Pass in the merge: true prop to allow merging instead of plain overwrite
    await database.setDoc(docRefToWriteTo, formattedUserData, { merge: true });
};