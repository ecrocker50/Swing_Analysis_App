import { useReducer } from 'react';
import { UserSessionsData, SingleSwing, SingleDataPoint, SingleSession, Quaternion, Position, Mode } from '../types'

/**
 * 
 */
export const getQuaternions = (userData: UserSessionsData, sessionName: string, swing: number, time: number): Quaternion => {
    //const index = getIndexOfSession(userData, sessionName);
    //const swingData = getSwing(userData, sessionName, swing);
    const swingPoints = getPointsInsideASwing(userData, sessionName, swing);
    let quaternion: Quaternion = {real: 0, i: 0, j: 0, k: 0};
    swingPoints.forEach(dataPoint => {
        if(time === dataPoint.time){
            quaternion = dataPoint.quaternion;
            return quaternion;
        }
    });
    return quaternion;
}

export const getPosition = (userData: UserSessionsData, sessionName: string, swing: number, time: number): Position => {
    //const index = getIndexOfSession(userData, sessionName);
    //const swingData = getSwing(userData, sessionName, swing);
    const swingPoints = getPointsInsideASwing(userData, sessionName, swing);
    let position: Position = {x: 0, y: 0, z: 0};
    swingPoints.forEach(dataPoint => {
        if(time === dataPoint.time){
            position = dataPoint.position;
            return position;
        }
    });
    return position;
}


/** Gets an array of all the session names inside the userData object
 * 
 * @param userData the userData object with all the sessions in it
 * @returns Array\<string> - an array of strings with the session names inside it
 */
export const getAllSessionNames = (userData: UserSessionsData): Array<string> => {
    const sessionNames: Array<string> = [];

    userData.forEach(session => {
        sessionNames.push(session.sessionName);
    });

    return sessionNames;
};

 
/** Gets the index of the specified session
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to get the swings of
 * @returns number - the index of the session
 */
export const getIndexOfSession = (userData: UserSessionsData, sessionName: string): number => {
    let index: number = -1;

    userData.forEach((session, i) => {
        if (sessionName === session.sessionName) {
            index = i;
        }
    });

    return index;
};


/** Gets an array of the swings inside of a session
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to get the swings of
 * @returns Array\<SingleSwing> - an array of swings that the session had
 */
export const getSwingsInsideSession = (userData: UserSessionsData, sessionName: string): Array<SingleSwing> => {
    let swings: Array<SingleSwing> = [];

    userData.forEach(session => {
        if (session.sessionName === sessionName) {
            swings = session.swings;
        }
    });

    // if session doesn't exist, return an empty array
    return swings;
};


/** Gets the points inside a single swing.
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to get the swings of
 * @param swingIndex the index of the swing to get the points of
 * @returns Array\<SingleDataPoint> - an array of Points that the swing had
 */
export const getPointsInsideASwing = (userData: UserSessionsData, sessionName: string, swingIndex: number): Array<SingleDataPoint> => {
    const swing = getSwing(userData, sessionName, swingIndex);

    return swing.points;
};


/** Gets the data contained in one swing
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to get the swings of
 * @param swingIndex the index of the swing to get the data of
 * @returns SingleDataPoint - The data inside the swing
 */
export const getSwing = (userData: UserSessionsData, sessionName: string, swingIndex: number): SingleSwing => {
    const swings = getSwingsInsideSession(userData, sessionName);
    const selectedSwing = swings[swingIndex];

    return selectedSwing;
};


/** Gets an array of all the times contained in a swing
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to get the swings of
 * @param swingIndex the index of the swing to get the time data of
 * @returns Array\<number> - an array of times that each point is
 */
export const getTimesOfAllPointsInSwing = (userData: UserSessionsData, sessionName: string, swingIndex: number): Array<number> => {
    const times: Array<number> = [];
    const points = getPointsInsideASwing(userData, sessionName, swingIndex);

    points.forEach(point => {
        times.push(point.time);
    });

    return times;
};


/** Adds a swing to the specified session
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to put the swing in
 * @param swingData the swing to add the specified session
 */
export const pushSwing = (userData: UserSessionsData, sessionName: string, swingData: SingleSwing) => {
    const indexOfSession = getIndexOfSession(userData, sessionName);

    userData[indexOfSession].swings.push(swingData);
};


/** Add a new data point to a specified swing
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session that the swing is in
 * @param swingIndex the index of the swing to put the point in
 * @param pointData the point to push to the swing
 */
export const pushDataPoint = (userData: UserSessionsData, sessionName: string, swingIndex: number, pointData: SingleDataPoint) => {
    const indexOfSession = getIndexOfSession(userData, sessionName);

    userData[indexOfSession].swings[swingIndex].points.push(pointData);
    //userData[indexOfSession].swings[swingIndex].points.position.x.push()
};

export const setPosition = (userData: UserSessionsData, sessionName: string, swingIndex: number, pointIndex: number, x: number, y: number, z: number) => {
    const indexOfSession = getIndexOfSession(userData, sessionName);

    userData[indexOfSession].swings[swingIndex].points[pointIndex].position.x = x;
    userData[indexOfSession].swings[swingIndex].points[pointIndex].position.y = y;
    userData[indexOfSession].swings[swingIndex].points[pointIndex].position.z = z;
}


/** Create a new, empty session that data can be pushed into
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



/** Gets the maximum (ending) time of the swing in MILLISECONDS
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session that the swing is in
 * @param swingIndex the index of the swing to check
 * @returns number - the max time in milliseconds
 */
export const getMaxTimeOfSwing = (userData: UserSessionsData, sessionName: string, swingIndex: number): number => {
    const swing = getSwing(userData, sessionName, swingIndex);
    const len = swing.points.length;

    return swing.points[len - 1].time;
};


/** Gets the time of contact for a specified swing
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session that the swing is in
 * @param swingIndex the index of the swing to check
 * @returns number - the time in milliseconds
 */
export const getTimeOfContact = (userData: UserSessionsData, sessionName: string, swingIndex: number): number => {
    const swing = getSwing(userData, sessionName, swingIndex);

    return swing.timeOfContact;
};


/** Gets the mode of a session
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to get the mode of
 * @returns Mode - the mode that the session is
 */
export const getModeOfSession = (userData: UserSessionsData, sessionName: string): Mode => {
    const sessionIndex = getIndexOfSession(userData, sessionName);
    
    return userData[sessionIndex].mode;
}


/** Checks to see if the given session name already exists within the user's data
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to check
 * @returns Boolean - whether the session was found or not
 */
export const doesSessionExist = (userData: UserSessionsData, sessionName: string): Boolean => {
    const sessionNames = getAllSessionNames(userData);
    return sessionNames.includes(sessionName);
};


export const crappyDataMock: UserSessionsData = [
    {
        sessionName: "session0",
        mode: "Backhand",
        swings: [
            {
                points: [
                    {
                        time: 0,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 1,
                        quaternion: {real: 0.2, i: 0.2, j: 0.2, k: 0.2},
                        position: {x: 2, y: 2, z: 2}
                    },
                    {
                        time: 3,
                        quaternion: {real: 0.3, i: 0.3, j: 0.3, k: 0.3},
                        position: {x: 3, y: 3, z: 3}
                    },
                    {
                        time: 5,
                        quaternion: {real: 0.4, i: 0.4, j: 0.4, k: 0.4},
                        position: {x: 4, y: 4, z: 4}
                    },
                    {
                        time: 6,
                        quaternion: {real: 0.5, i: 0.5, j: 0.5, k: 0.5},
                        position: {x: 5, y: 5, z: 5}
                    },
                    {
                        time: 8,
                        quaternion: {real: 0.6, i: 0.6, j: 0.6, k: 0.6},
                        position: {x: 6, y: 6, z: 6}
                    },
                    {
                        time: 11,
                        quaternion: {real: 0.7, i: 0.7, j: 0.7, k: 0.7},
                        position: {x: 7, y: 7, z: 7}
                    },
                    {
                        time: 13,
                        quaternion: {real: 0.8, i: 0.8, j: 0.8, k: 0.8},
                        position: {x: 8, y: 8, z: 8}
                    },
                ],
                timeOfContact: 8
            },
            {
                points: [
                    {
                        time: 0,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 1,
                        quaternion: {real: 0.2, i: 0.2, j: 0.2, k: 0.2},
                        position: {x: 2, y: 2, z: 2}
                    },
                    {
                        time: 2,
                        quaternion: {real: 0.3, i: 0.3, j: 0.3, k: 0.3},
                        position: {x: 3, y: 3, z: 3}
                    },
                    {
                        time: 3,
                        quaternion: {real: 0.4, i: 0.4, j: 0.4, k: 0.4},
                        position: {x: 4, y: 4, z: 4}
                    },
                    {
                        time: 6,
                        quaternion: {real: 0.5, i: 0.5, j: 0.5, k: 0.5},
                        position: {x: 5, y: 5, z: 5}
                    },
                    {
                        time: 7,
                        quaternion: {real: 0.6, i: 0.6, j: 0.6, k: 0.6},
                        position: {x: 6, y: 6, z: 6}
                    },
                    {
                        time: 8,
                        quaternion: {real: 0.7, i: 0.7, j: 0.7, k: 0.7},
                        position: {x: 7, y: 7, z: 7}
                    },
                    {
                        time: 9,
                        quaternion: {real: 0.8, i: 0.8, j: 0.8, k: 0.8},
                        position: {x: 8, y: 8, z: 8}
                    },
                ],
                timeOfContact: 6
            }
        ]
    },
    {
        sessionName: "session1",
        mode: "Forehand",
        swings: [
            {
                points: [
                    {
                        time: 0,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 1,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 4,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 6,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 12,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 22,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 26,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 27,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                ],
                timeOfContact: 22
            },
            {
                points: [
                    {
                        time: 0,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 2,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 4,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 9,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 11,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 13,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 14,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 19,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                ],
                timeOfContact: 9
            }
        ]
    },
];