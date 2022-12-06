import { UserSessionsData, SingleSwing, SingleDataPoint, Quaternion, Position, Mode } from '../../types'



/** Gets the quaternion associates with a specific time in a swing
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session the quaternion is inside
 * @param swing the index of the swing the quaternion is inside
 * @param time the time of the swing the quaternion is at
 * @returns Quaternion - the quaternion at the specified time
 */
export const getQuaternion = (userData: UserSessionsData, sessionName: string, swing: number, time: number): Quaternion => {
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


/** Gets the Position associates with a specific time in a swing
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session the position is inside
 * @param swing the index of the swing the position is inside
 * @param time the time of the swing the quaternion is at
 * @returns Position - the position at the specified time
 */
export const getPosition = (userData: UserSessionsData, sessionName: string, swing: number, time: number): Position => {
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


/** Gets number of swings inside a session
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session to get the swings of
 * @returns number - the number of swings inside the session
 */
export const getNumberOfSwingsInsideSession = (userData: UserSessionsData, sessionName: string): number => {
    let numberOfSwings = -1;
    userData.forEach(session => {
        if (session.sessionName === sessionName) {
            numberOfSwings = session.swings.length;
        }
    });

    return numberOfSwings;
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
            session.swings.forEach((element) => {
                swings.push(element);
            });
        }
    });

    // if session doesn't exist, return an empty array
    return swings;
};

export const doesSessionHaveSwings = (userData: UserSessionsData, sessionName: string): number => {
    const index = getIndexOfSession(userData, sessionName);
    if(userData[index].swings === undefined)
    {
        return 0;
    }
    return userData[index].swings.length;
}


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


/** Gets the maximum (ending) time of the swing in MILLISECONDS
 * 
 * @param userData the userData object with all the sessions in it
 * @param sessionName the name of the session that the swing is in
 * @param swingIndex the index of the swing to check
 * @returns number - the max time in milliseconds
 */
export const getMaxTimeOfSwing = (userData: UserSessionsData, sessionName: string, swingIndex: number): number => {
    const times = getTimesOfAllPointsInSwing(userData, sessionName, swingIndex);

    if (times.length === 0)
    {
        console.log("max time is 0 because could not get all times");
        return 0;
    }

    return times[times.length - 1];
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

    if (sessionIndex === -1) 
    {
        return "Unknown";
    }
    
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



/** Gets the last added session name in userData
 * 
 * @param userData the userData object with all the sessions in it
 * @returns string - the sessionName of the last added session
 */
export const getLastAddedSessionName = (userData: UserSessionsData): string => {
    return userData[userData.length - 1].sessionName;
};



export const getPositionPointsInsideSwing = (userData: UserSessionsData, sessionName: string, swingIndex: number): Array<Position> => {
    const arrayOfPos: Array<Position> = [];

    const fullPoints = getPointsInsideASwing(userData, sessionName, swingIndex);

    fullPoints.forEach((point) => {
        arrayOfPos.push(point.position);
    });

    return arrayOfPos;
};


export const getTimeOfMidSwing = (userData: UserSessionsData, sessionName: string, swingIndex: number): number => {
    const swing = getSwing(userData, sessionName, swingIndex);

    const numOfPoints = swing.points.length;
    const time = swing.points[Math.floor(numOfPoints / 2)].time;

    return time;
}
