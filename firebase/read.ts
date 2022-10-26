import { AnyAction } from '@reduxjs/toolkit';
import * as database from 'firebase/firestore';
import { Dispatch } from 'react';
import { setFullUserData } from '../store/swingDataSlice';
import { UserSessionsData } from '../types';
import { firestore } from './firebaseInstance';



/** Gets the user's sessions from the Firestore database and returns them.
 * This will happen asynchronously. 
 * 
 * @param docToGet - the document to get the sessions from. Defaults to 'swingData', which can be left as so.
 * @returns Promise<UserSessionsData> - The user's session data from the database
 */
export const getUserSessionsFromDocumentInDB = async (docToGet: string = "swingData"): Promise<UserSessionsData> => {
    
    let sessions: UserSessionsData = []; 

    // Get the Firestore collection reference
    const collectionRef = database.collection(firestore, "user1");

    await database.getDocs(collectionRef).then(docSnapshot => {
        // Append each document (a single session) to the sessions variable
        docSnapshot.docs.map((document) => {
            if (document.id === docToGet) {
                sessions = (document.data().userSessions as UserSessionsData)
            }
        });
    });

    return sessions
}





/** Populates the 'userData' property inside the store with data from the database.
 * This happens asynchronously.
 * 
 * @param dispatch The dispatch hook
 */
 export const populateUserDataStoreFromDB = async (dispatch: Dispatch<AnyAction>) => {
    // Get the user session data from the database
    const userSessions = await getUserSessionsFromDocumentInDB();

    // Dispatch the setFullUserData action to put the user session data in the store
    dispatch(setFullUserData(userSessions));
};