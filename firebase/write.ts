import * as database from 'firebase/firestore';
import { UserSessionsData } from '../types';
import { firestore } from './firebaseInstance';




/** Writes userData to the database document. 
 * 
 * @param userData - the userData to put into docToWriteTo inside the database
 * @param docToWriteTo - The document to write to. Defaults to 'swingData', which can be left as so unless we want to create a backup or something. 
 */
export const setDocumentInDB = async (userData: UserSessionsData, docToWriteTo: string = "swingData") => {
    // Get the document reference that we will use as our target to write to
    const docRefToWriteTo = database.doc(firestore, "user1", docToWriteTo);

    // Format the userData to be able to be pushed to firebase
    const formattedUserData = {"userSessions": userData};

    // Set the session document, called docToWriteTo to collection 'user1'. Pass in the merge: true prop to allow merging instead of plain overwrite
    await database.setDoc(docRefToWriteTo, formattedUserData, { merge: true });
};

