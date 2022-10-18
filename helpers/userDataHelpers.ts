import { useReducer } from 'react';
import { UserSessionsData, SingleSwing, SingleDataPoint, SingleSession, Quaternion, Position } from '../types'

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
};


/** Create a new, empty session that data can be pushed into
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to create
 */
export const createNewEmptySession = (userData: UserSessionsData, sessionName: string) => {
    const newSession: SingleSession = {
        sessionName,
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


export const crappyDataMock = [
    {
        sessionName: "session0",
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
                        time: 3,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 5,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 6,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 8,
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
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 2,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 3,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 6,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 7,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 8,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                    {
                        time: 9,
                        quaternion: {real: 0.1, i: 0.1, j: 0.1, k: 0.1},
                        position: {x: 1, y: 1, z: 1}
                    },
                ],
                timeOfContact: 6
            }
        ]
    },
    {
        sessionName: "session1",
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