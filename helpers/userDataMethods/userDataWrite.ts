import { UserSessionsData, SingleSwing, SingleDataPoint, SingleSession, Mode } from '../../types'
import { getIndexOfSession } from './userDataRead';




/** Adds a swing to the specified session. Note that this needs to be called in a reducer to have effect on store.
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to put the swing in
 * @param swingData the swing to add the specified session
 */
export const pushSwing = (userData: UserSessionsData, sessionName: string, swingData: SingleSwing) => {
    const indexOfSession = getIndexOfSession(userData, sessionName);

    userData[indexOfSession].swings.push(swingData);
};



/** Add a new data point to a specified swing. Note that this needs to be called in a reducer to have effect on store.
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session that the swing is in
 * @param swingIndex the index of the swing to put the point in
 * @param pointData the point to push to the swing
 */
export const pushDataPoint = (userData: UserSessionsData, sessionName: string, swingIndex: number, pointData: SingleDataPoint) => {
    const indexOfSession = getIndexOfSession(userData, sessionName);

    userData[indexOfSession].swings[swingIndex].points.push(pointData);
};

/** Add a new data point to a specified swing. Note that this needs to be called in a reducer to have effect on store.
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session that the swing is in
 * @param swingIndex the index of the swing to put the point in
 * @param pointData the point to push to the swing
 */
 export const pushTimeOfContact = (userData: UserSessionsData, sessionName: string, swingIndex: number, timeOfContact: number) => {
    const indexOfSession = getIndexOfSession(userData, sessionName);

    userData[indexOfSession].swings[swingIndex].timeOfContact = timeOfContact;
};

export const setPosition = (userData: UserSessionsData, sessionName: string, swingIndex: number, pointIndex: number, x: number, y: number, z: number) => {
    const indexOfSession = getIndexOfSession(userData, sessionName);

    userData[indexOfSession].swings[swingIndex].points[pointIndex].position.x = x;
    userData[indexOfSession].swings[swingIndex].points[pointIndex].position.y = y;
    userData[indexOfSession].swings[swingIndex].points[pointIndex].position.z = z;
}


/** Create a new, empty session that data can be pushed into. Note that this needs to be called in a reducer to have effect on store.
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to create
 * @param sessionMode the mode of the session
 */
export const createNewEmptySession = (userData: UserSessionsData, sessionName: string, sessionMode: Mode) => {
    const newSession: SingleSession = {
        sessionName,
        mode: sessionMode,
        swings: []
    }

    userData.push(newSession);
};


/** Removes a session from userData. Note that this needs to be called in a reducer to have effect on store
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to delete
 */
export const removeSessionFromUserData = (userData: UserSessionsData, sessionName: string): void => {
    const index = getIndexOfSession(userData, sessionName);

    if (index !== -1) {
        userData.splice(index, 1);
    }
};
