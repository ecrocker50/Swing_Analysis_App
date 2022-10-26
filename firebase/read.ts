import * as database from 'firebase/firestore';
import { SingleSession, UserSessionsData } from '../types';
import { firestore } from '../firebase/firebaseInstance';




export async function getUserSessionsFromDB(): Promise<UserSessionsData> {
    
    let sessions: UserSessionsData = []; 

    // Get the Firestore collection reference
    const collectionRef = database.collection(firestore, "user1");

    await database.getDocs(collectionRef).then(docSnapshot => {
        // Append each document (a single session) to the sessions variable
        docSnapshot.docs.map((document) => sessions.push(document.data() as SingleSession));
    });

    return sessions
}