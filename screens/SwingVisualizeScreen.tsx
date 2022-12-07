import React, { Dispatch, useState } from 'react';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { AnyAction } from '@reduxjs/toolkit';
import { Text, View } from '../components/Themed';
import { buttonColor, styles } from '../styles';
import { doesSessionHaveSwings, getMaxTimeOfSwing, getNumberOfSwingsInsideSession, getPosition, getQuaternion, getSwingsInsideSession, getTimeOfContact, getTimesOfAllPointsInSwing, getPositionPointsInsideSwing, getTimeOfMidSwing, getCalibratedQuaternionFromSession, getSessionHandedness } from '../helpers/userDataMethods/userDataRead';
import {
    REDUCER_SET_CURRENT_TIME_IN_STORE,
    SELECTOR_CURRENT_TIME_SECONDS, 
} from '../store/timeSlice';
import {
    REDUCER_SET_SELECTED_SWING_IN_STORE,
    REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE,
    SELECTOR_SELECTED_SESSION,
    SELECTOR_USER_SESSIONS,
} from '../store/swingDataSlice';
import { Entypo } from '@expo/vector-icons';
import { RacketOrientationDisplay } from '../components/RacketOrientation';
import { LineChart } from 'react-native-chart-kit';
import { EulerAngles, Handedness, Position, Quaternion, SingleSession, SingleSwing, UserSessionsData } from '../types';
import { THREE } from 'expo-three';
import { degreesToRadians, radiansToDegrees } from '../helpers/numberConversions';
import { SELECTOR_CALIBRATED, SELECTOR_QUATERNION_CENTERED } from '../store/modeSelectSlice';


type PositionHorizontalVertical = {
    horiz: number,
    vert: number,
};

type GraphViewType = 'top' | 'side';


export default function SwingVisualizeScreen() {
    const dispatch = useDispatch();
    
    const currentTimeSeconds   = useSelector(SELECTOR_CURRENT_TIME_SECONDS);
    const selectedSession = useSelector(SELECTOR_SELECTED_SESSION);
    const userSessions    = useSelector(SELECTOR_USER_SESSIONS);
    const [chosenSwing,   setChosenSwing]   = useState<number>(0);
    const [graphView, setGraphView]         = useState<GraphViewType>('side');

    const quaternion  = getQuaternion(userSessions, selectedSession, chosenSwing, currentTimeSeconds);
    const position    = getPosition(userSessions, selectedSession, chosenSwing, currentTimeSeconds);

    const [isDropDownOpen, setIsDropDownOpenOpen] = useState(false);
    const numOfSwings = getNumberOfSwingsInsideSession(userSessions, selectedSession);

    // const isCalibrated = useSelector(SELECTOR_CALIBRATED);


    if(chosenSwing !== -1)
    {
        const swingIndexMap = Array.apply(null, Array(numOfSwings)).map((val, index) => {return {label: index.toString(), value: index}});
        const allSwingTimePoints = getTimesOfAllPointsInSwing(userSessions, selectedSession, chosenSwing);
        const maxSwingValue = getMaxTimeOfSwing(userSessions, selectedSession, chosenSwing);
        const swings = getSwingsInsideSession(userSessions, selectedSession);
        let positionPoints = getPositionPointsInsideSwing(userSessions, selectedSession, chosenSwing);

        // const quaternionToSet = new THREE.Quaternion(quaternion.i, quaternion.j, quaternion.k, quaternion.real);

        // const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);

        // const timeOfMidPoint = getTimeOfMidSwing(userSessions, selectedSession, chosenSwing);
        // const quaternionOfMidPoint = getQuaternion(userSessions, selectedSession, chosenSwing, timeOfMidPoint);
        // const midPointEuler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(quaternionOfMidPoint.i, quaternionOfMidPoint.j, quaternionOfMidPoint.k, quaternionOfMidPoint.real));

        const calibratedQuaternion = getCalibratedQuaternionFromSession(userSessions, selectedSession);
        const calibratedEuler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(calibratedQuaternion.i, calibratedQuaternion.j, calibratedQuaternion.k, calibratedQuaternion.real));
        const sessionHandedness = getSessionHandedness(userSessions, selectedSession);

        const isCalibrated = isNaN(calibratedEuler.x) && isNaN(calibratedEuler.y) && calibratedEuler.z === 0;

        const timeOfContactText = getTimeOfContactDisplay(userSessions, selectedSession, chosenSwing);

        const indexOfContact = getIndexOfTime(getTimeOfContact(userSessions, selectedSession, chosenSwing), allSwingTimePoints);
        
        return (
            <View style={styles.topContainer}>
                
                <ScrollView nestedScrollEnabled={true}>
                <Text style={{...styles.title, textAlign: 'center', marginLeft: 0}}>
                    Selected swing
                </Text>

                <DropDownPicker
                    open={isDropDownOpen}
                    value={chosenSwing}
                    items={swingIndexMap}
                    setOpen={setIsDropDownOpenOpen}
                    setValue={setChosenSwing}
                    searchable={true}
                    closeAfterSelecting={true}
                    closeOnBackPressed={true}
                    TickIconComponent={({style}: any) => <Entypo name='magnifying-glass' size={20} style={style} />}
                    style={{width: '60%', alignSelf: 'center'}}
                    textStyle={styles.normalText}
                    listMode='SCROLLVIEW'
                    placeholderStyle={styles.normalText}
                    searchPlaceholder={"Search a Swing"}
                    searchTextInputStyle={styles.normalText}
                    dropDownContainerStyle={{width: '60%', alignSelf: 'center'}}
                    listItemLabelStyle={styles.normalText}
                    ListEmptyComponent={() => <View style={{height: 35}}><Text style={{...styles.normalText, marginTop: 4, fontStyle: 'italic'}}>No Data</Text></View>}
                    />


                <View style={{flexDirection: 'row', alignSelf: 'center', paddingTop: 8, backgroundColor: 'transparent'}}>
                    <TouchableOpacity 
                        style={styles.buttonRed}
                        onPress={() => {
                            if(chosenSwing > 0)
                            {
                                setChosenSwing(chosenSwing-1)
                                dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing));
                            }
                        }} >
                            <Text style={styles.buttonText}>Prev</Text>
                    </TouchableOpacity>

                    <View style={styles.space_small} />
                    <TouchableOpacity 
                        style={{...styles.buttonGreen, marginLeft: 10}}
                        onPress={() => {
                            if(chosenSwing < getSwingsInsideSession(userSessions, selectedSession).length - 1)
                            {
                                setChosenSwing(chosenSwing+1);
                                dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing));
                            }
                        }} >
                            <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.space_extra_small}></View>

                <View style={styles.fullSeparator}></View>

                    
                    <View style={styles.space_extra_small}></View>
                    <View style={{borderWidth: 2, borderColor: buttonColor, borderRadius: 20, width: '80%', alignSelf: 'center'}}>
                        { RacketOrientationDisplay(currentTimeSeconds, quaternion, calibratedEuler, isCalibrated) }
                    </View>



                    {/* <Text>{isOrientationFactingDown(euler) ? "D  " : "U  "} {radiansToDegrees(euler.z)}</Text>
                    <Text>{isOrientationFactingBack(euler) ? "B  " : "F  "} {radiansToDegrees(euler.x)}</Text>
                    <Text>{isOrientationMostlyFacingBackDuringMid(userSessions, selectedSession, chosenSwing) ? "Mostly Back  " : "Mostly Forward  "} {radiansToDegrees(euler.x)}</Text> */}
                    

                    {renderScatterPlot(positionPoints, currentTimeSeconds, allSwingTimePoints, graphView, position, calibratedEuler, sessionHandedness, indexOfContact)}
                    <View style={{width: '60%', alignItems: 'center', alignSelf: 'center', marginTop: -25}}>
                        <TouchableOpacity 
                            style={styles.buttonRegular}
                            onPress={() => {
                                setGraphView(graphView === 'side' ? 'top' : 'side')
                            }} >
                                <Text style={styles.buttonText}>Change View</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.space_extra_small}></View>

                    <Text style={{...styles.boldText, textAlign: 'center'}}>
                        Time of Contact: {timeOfContactText}   {'\n'}
                        Current Time:   {currentTimeSeconds.toFixed(6)}s
                    </Text>

                    <Slider 
                        style={styles.slider} 
                        onValueChange={(value) => correctSliderValueAndSetStore(dispatch, value, allSwingTimePoints)}
                        maximumValue={maxSwingValue}
                        minimumValue={0}
                    />

                    <View style={styles.space_small}></View>
                    
                    <Text style={{...styles.boldText, textAlign: 'center'}}>Speed at Contact: {getSpeedOfContactDisplay(swings, chosenSwing, timeOfContactText)}</Text>
{/*                     
                    <Text style={styles.normalText}>Euler x:   {radiansToDegrees(euler.x)}</Text>
                    <Text style={styles.normalText}>Euler y:   {radiansToDegrees(euler.y)}</Text>
                    <Text style={styles.normalText}>Euler z:   {radiansToDegrees(euler.z)}</Text>

                    <Text style={styles.normalText}>Quaternion real:   {quaternion.real}</Text>
                    <Text style={styles.normalText}>Quaternion i:   {quaternion.i}</Text>
                    <Text style={styles.normalText}>Quaternion j:   {quaternion.j}</Text>
                    <Text style={styles.normalText}>Quaternion k:   {quaternion.k}</Text> */}

                    <View style={styles.space_extra_large} />
                    <View style={styles.space_medium} />

                    <View style={{width: '60%', alignItems: 'center', alignSelf: 'center'}}>
                        <TouchableOpacity 
                            style={styles.buttonRed}
                            onPress={() => {
                                dispatch(REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE({sessionName: selectedSession, swingIndex: chosenSwing}));
                                if(doesSessionHaveSwings(userSessions, selectedSession) === 1)
                                {
                                    setChosenSwing(-1);
                                }
                                else
                                {
                                    if(chosenSwing === 0)
                                    {
                                        setChosenSwing(chosenSwing);
                                    }
                                    else
                                    {
                                        setChosenSwing(chosenSwing-1);
                                    }
                                }
                            }} >
                                <Text style={styles.buttonText}>Delete Swing</Text>
                        </TouchableOpacity>
                    </View>

                    
                    <View style={styles.space_large} />

                    <Text style={{color: 'white', paddingBottom: 250}}>THIS IS TO GET SCROLL TO WORK</Text>

                </ScrollView>
            </View>
        );
    }
    else{
        return(
            <View style={styles.topContainer}>
                <Text style={styles.title}>Swing Visualization</Text>
                <View style={styles.lineUnderTitle}/>
                <View style={styles.space_medium} />
                <View style={styles.space_extra_large}/>
                <Text style={styles.normalText}> No Swings Found </Text>
            </View>
        );
    }
}


const getTimeOfContactDisplay = (userSessions: UserSessionsData, selectedSession: string, selectedSwing: number): string => {
    const contact = getTimeOfContact(userSessions, selectedSession, selectedSwing).toFixed(6) + "s";

    if (contact === "-1.000000s") {
        return "N/A";
    }
    return contact;
}


const getSpeedOfContactDisplay = (swings: SingleSwing[], chosenSwing: number, timeOfContactDisplay: string): string => {
    const speed = swings[chosenSwing].contactSpeed;

    if (speed === 0 || speed === undefined || timeOfContactDisplay === 'N/A') {
        return "N/A";
    }

    return speed.toString();
}


/** Corrects the raw slider value. Prevents the bug of it trying to find data for a time that we don't have any for
 * @example correctSliderValueAndSetStore(dispatch, 8, [1, 2, 3, 6, 9, 10, 15, 21, 23]);
 *          // This ^^^ sets currentTimeMilliseconds in the store
 *      Then, the time will be set to the next largest after the target, so in this case 9.
 * 
 * @param dispatch The dispatch hook
 * @param rawValue the raw value that the slider is set to
 * @param allSwingTimePoints An array of numbers that represent all points in time of the swing. THESE MUST BE IN ASCENDING ORDER
 */
 const correctSliderValueAndSetStore = (dispatch: Dispatch<AnyAction>, rawValue: number, allSwingTimePoints: Array<Number>) => {
    // Find the element that is the first one to be >= the raw value it tries to set to.
    // This ONLY works if allSwingTimePoints is in ascending order. 
    const element = allSwingTimePoints.find((time) => time >= rawValue);

    const newValue = element !== undefined ? element : rawValue

    dispatch(REDUCER_SET_CURRENT_TIME_IN_STORE(parseFloat(newValue.toFixed(6))));
};


const getIndexOfTime = (currentTime: number, allSwingTimePoints: Array<Number>): number => {
    // Find the element that is the first one to be >= the raw value it tries to set to.
    // This ONLY works if allSwingTimePoints is in ascending order. 
    if (currentTime === -1 || currentTime === 0) {
        return -1;
    }

    let index: number = 0;
    const element = allSwingTimePoints.find((time, idx) => { 
        if (time >= currentTime) {
            index = idx;
            return true;
        }
    });
    return index;
}


const getSideViewPositionPoints = (positionPoints: Array<Position>): Array<PositionHorizontalVertical> => {
    // Calculate distance to point <x, y> for each point in positionPoints. This will be the horiz component of the position
    // Then, use the z component of each point in positionPoints to get the vertical component of the position
    // Return an array of <horiz, vert> points

    let zMin = 1000;
    positionPoints.forEach(point => {
        if (point.z < zMin) {
            zMin = point.z;
        }
    });

    const twoDimensionalReconstruction: Array<PositionHorizontalVertical> = [];
    positionPoints.forEach((point) => {
        const horizPoint: PositionHorizontalVertical = {
            horiz: Math.sqrt(point.x**2 + point.y**2),
            vert:  zMin < 0 ? point.z -= zMin : point.z
        }
        twoDimensionalReconstruction.push(horizPoint);
    });

    return twoDimensionalReconstruction;
};




const isOrientationFactingDown = (euler: any): boolean => {
    // If the euler angle is facing down, then the z component is negative
    // console.log(euler.z);
    if (euler.z < 0) {
        return true;
    }
    return false;
};


const isOrientationFactingBack = (euler: any): boolean => {
    // If the euler angle is facing down, then the z component is negative
    // console.log(euler.x);
    if (euler.x < 0) {
        return true;
    }
    return false;
};



const isOrientationMostlyFacingBackDuringMid = (userSessions: UserSessionsData, selectedSession: string, chosenSwing: number): boolean => {
    const swings = getSwingsInsideSession(userSessions, selectedSession);

    const numOfPoints = swings[chosenSwing].points.length;
    let numOfPointsFacingBack = 0;

    for (let i = 5; i < numOfPoints - 5; i++) {
        const quaternionToSet = new THREE.Quaternion(swings[chosenSwing].points[i].quaternion.i, swings[chosenSwing].points[i].quaternion.j, swings[chosenSwing].points[i].quaternion.k, swings[chosenSwing].points[i].quaternion.real);
        const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);
        if (isOrientationFactingBack(euler)) {
            numOfPointsFacingBack++;
        }
    };
    // swings[chosenSwing].points.forEach((point) => {
    //     const quaternionToSet = new THREE.Quaternion(point.quaternion.i, point.quaternion.j, point.quaternion.k, point.quaternion.real);
    //     const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);
    //     if (isOrientationFactingBack(euler)) {
    //         numOfPointsFacingBack++;
    //     }
    // });

    if (numOfPointsFacingBack > Math.floor((numOfPoints-10)/2)) {
        return true;
    }

    return false;
};


const addOffsetToCorrectNegativeValues = (positionPoints: Array<Position>, shouldFlip: boolean): Array<Position> => {
    let positionPointsCorrected: Array<Position> = [];

    positionPoints.forEach((point) => {
        positionPointsCorrected.push({...point});
    });



    // Find the minimum value in the array
    let minX = positionPoints[0].x;
    let minY = positionPoints[0].y;
    let minZ = positionPoints[0].z;

    // Find the maximum value in the array
    let maxX = positionPoints[0].x;
    let maxY = positionPoints[0].y;
    let maxZ = positionPoints[0].z;
    

    positionPoints.forEach((point) => {
        if(point.x < minX) {
            minX = point.x;
        }
        else if (point.x > maxX) {
            maxX = point.x;
        }
        if(point.y < minY) {
            minY = point.y;
        }
        else if (point.y > maxY) {
            maxY = point.y;
        }
        if(point.z < minZ) {
            minZ = point.z;
        }
        else if (point.z > maxX) {
            maxZ = point.z;
        }
    });

    const averageValueZ = (maxZ - minZ) / 2;

    positionPoints.forEach((point, idx) => {
        let x = point.x;
        let y = point.y;
        let z = point.z;
        if(minX < 0) {
            x -= minX;
        }
        if(minY < 0) {
            y -= minY;
        }
        if(minZ < 0) {
            z -= minZ;            
        }

        if (z > averageValueZ) {
            z = averageValueZ - (z - averageValueZ);
        } else {
            z = averageValueZ + (averageValueZ - z);
        }
            
        positionPointsCorrected[(positionPoints.length - 1) - idx] = {x, y, z}
    });

    return positionPointsCorrected;
};


const getMidPointOfRotation = (positionPoints: Array<Position>): Position => {
    // Find the minimum value in the array
    let minX = positionPoints[0].x;
    let minY = positionPoints[0].y;
    let minZ = positionPoints[0].z;

    // Find the maximum value in the array
    let maxX = positionPoints[0].x;
    let maxY = positionPoints[0].y;
    let maxZ = positionPoints[0].z;

    positionPoints.forEach((point) => {
        if(point.x < minX) {
            minX = point.x;
        }
        else if (point.x > maxX) {
            maxX = point.x;
        }
        if(point.y < minY) {
            minY = point.y;
        }
        else if (point.y > maxY) {
            maxY = point.y;
        }
        if(point.z < minZ) {
            minZ = point.z;
        }
        else if (point.z > maxX) {
            maxZ = point.z;
        }
    });

    const midPoint: Position = {
        x: (maxX - minX) / 2,
        y: (maxY - minY) / 2,
        z: (maxZ - minZ) / 2
    };

    return midPoint;
};

const rotatePointAroundPoint = (point: Position, midPoint: Position, angle: number): Position => {
    // Rotate the point around the midPoint by the angle

    // First, translate the point so that the midPoint is at the origin
    const translatedPoint: Position = {
        x: point.x - midPoint.x,
        y: point.y - midPoint.y,
        z: point.z - midPoint.z
    };

    // Rotate the point around the origin by the angle
    const rotatedPoint: Position = {
        x: translatedPoint.x * Math.cos(degreesToRadians(angle)) - translatedPoint.y * Math.sin(degreesToRadians(angle)),
        y: translatedPoint.x * Math.sin(degreesToRadians(angle)) + translatedPoint.y * Math.cos(degreesToRadians(angle)),
        z: translatedPoint.z
    };

    // Translate the point back to its original position
    const rotatedTranslatedPoint: Position = {
        x: rotatedPoint.x + midPoint.x,
        y: rotatedPoint.y + midPoint.y,
        z: rotatedPoint.z + midPoint.z
    };

    return rotatedTranslatedPoint;
};




const addOffsetTopView = (positionPoints: Array<Position>): Array<Position> => {
    let positionPointsCorrected: Array<Position> = [];

    positionPoints.forEach((point) => {
        positionPointsCorrected.push({...point});
    });



    // Find the minimum value in the array
    let minX = positionPoints[0].x;
    let minY = positionPoints[0].y;
    let minZ = positionPoints[0].z;

    // Find the maximum value in the array
    let maxX = positionPoints[0].x;
    let maxY = positionPoints[0].y;
    let maxZ = positionPoints[0].z;
    

    positionPoints.forEach((point) => {
        if(point.x < minX) {
            minX = point.x;
        }
        else if (point.x > maxX) {
            maxX = point.x;
        }
        if(point.y < minY) {
            minY = point.y;
        }
        else if (point.y > maxY) {
            maxY = point.y;
        }
        if(point.z < minZ) {
            minZ = point.z;
        }
        else if (point.z > maxX) {
            maxZ = point.z;
        }
    });

    positionPoints.forEach((point, idx) => {
        let x = point.x;
        let y = point.y;
        let z = point.z;
        if(minX < 0) {
            x -= minX;
        }
        if(minY < 0) {
            y -= minY;
        }
        if(minZ < 0) {
            z -= minZ;            
        }

        positionPointsCorrected[idx] = {x, y, z}
    });

    return positionPointsCorrected;
};


const doesGraphNeedFlip = (eulerAngles: any): boolean => {
    const degrees = radiansToDegrees(eulerAngles.z);
    console.log(degrees);
    if (degrees < 45) {
        return false;
    }

    return true;
};





const flipGraphHorizontally = (sideViewPoints: Array<PositionHorizontalVertical>) => {
    let positionPointsCorrected: Array<PositionHorizontalVertical> = [];

    // Find the minimum value in the array
    let minX = sideViewPoints[0].horiz;

    // Find the maximum value in the array
    let maxX = sideViewPoints[0].horiz;
    

    sideViewPoints.forEach((point) => {
        if (point.horiz < minX) {
            minX = point.horiz;
        }
        else if (point.horiz > maxX) {
            maxX = point.horiz;
        }
    });

    const averageValueX = (maxX - minX) / 2;

    sideViewPoints.forEach((point, idx) => {
        let x = point.horiz;
        if(minX < 0) {
            x -= minX;
        }

        if (x > averageValueX) {
            x = averageValueX - (x - averageValueX);
        } else {
            x = averageValueX + (averageValueX - x);
        }
            
        positionPointsCorrected.push({horiz: x, vert: sideViewPoints[idx].vert})
    });

    return positionPointsCorrected;
}

const renderScatterPlot = (positionPoints: Array<Position>, selectedTime: number, allSwingTimePoints: Array<number>, graphView: GraphViewType, selectedPosition: Position, eulerAngles: any, sessionHandedness: Handedness, indexOfContact: number) => {
    
    if (positionPoints === undefined || positionPoints.length === 0) {
        return (<View></View>);
    };
    
    const xLabels: string[] = [];
    const yValues: number[] = [];
    let shouldFlip = true;
    if (graphView === 'side') {
        shouldFlip = doesGraphNeedFlip(eulerAngles);
        console.log(shouldFlip);
    }
    // console.log(doesGraphNeedFlip(eulerAngles));

    positionPoints = addOffsetToCorrectNegativeValues(positionPoints, shouldFlip);


    // console.log(eulerAngles);
    if (isNaN(eulerAngles.x) && isNaN(eulerAngles.y) && eulerAngles.z === 0) {
        console.log("NO CALIBRATED QUATERNION IN THIS SESSION");
    };

    if (graphView === 'side') {
        let sideViewPoints = getSideViewPositionPoints(positionPoints);

        if (shouldFlip === false) {
            sideViewPoints = flipGraphHorizontally(sideViewPoints);
        }
        
        sideViewPoints.forEach((point) => {
            xLabels.push(point.horiz.toString());
            yValues.push(point.vert);
        });
    }
    else { 
        const midPointOfRotation = getMidPointOfRotation(positionPoints);
        let rotatedPoints: Array<Position> = [];

        positionPoints.forEach((point) => {
            // rotate the point counterclockwise around the midPointOfRotation 
            if (isNaN(eulerAngles.x) && isNaN(eulerAngles.y) && eulerAngles.z === 0 && 0) {
                xLabels.push(point.x.toString());
                yValues.push(point.y);
            } else {
                let degreeToRotate;
                if (sessionHandedness === 'Right') {
                    // if (eulerAngles.z > 0) {
                    //     degreeToRotate = eulerAngles.z - 90;
                    // } else {
                    //     degreeToRotate = eulerAngles.z + 270;
                    // }

                    degreeToRotate = 180 + radiansToDegrees(eulerAngles.z);
                    // if (eulerAngles.z >= 0) {
                    //     degreeToRotate = 180 + radiansToDegrees(eulerAngles.z);
                    // } else if (eulerAngles.z > -1.5) {
                    //     degreeToRotate = 0//90 + radiansToDegrees(eulerAngles.z);
                    // } else {
                    //     degreeToRotate = 0//180 + radiansToDegrees(eulerAngles.z);
                    // }
                } else {

                    if (eulerAngles.z >= 0) {
                        degreeToRotate = radiansToDegrees(eulerAngles.z);
                    } else {
                        degreeToRotate = radiansToDegrees(eulerAngles.z);
                    }
                }
                // const degreeToRotate = sessionHandedness === 'Right' ? 180 + radiansToDegrees(eulerAngles.z) : radiansToDegrees(eulerAngles.z);
                const rotatedPoint = rotatePointAroundPoint(point, midPointOfRotation, degreeToRotate);//radiansToDegrees(eulerAngles.x));  radiansToDegrees(eulerAngles.z) + 180
                rotatedPoints.push(rotatedPoint);
                // xLabels.push(rotatedPoint.x.toString());
                // yValues.push(rotatedPoint.y);
            }

            
            // xLabels.push(point.x.toString());
            // yValues.push(point.y);
        });

        
        // rotatedPoints = addOffsetToCorrectNegativeValues(rotatedPoints);
        rotatedPoints = addOffsetTopView(rotatedPoints);

        rotatedPoints.forEach((point) => { 
            xLabels.push(point.x.toString());
            yValues.push(point.y);
        });
    }

    // const chartData = positionPoints.map((point, index) => {
    //     return {
    //         ...point,
    //         index
    //     }
    // });


    const indexOfTime = getIndexOfTime(selectedTime, allSwingTimePoints);

    return (
        <View>
            {/* <View style={{position: 'absolute', top: -10, left: Dimensions.get('window').width - 60}}>
                <MaterialIcons.Button name="skip-next" onPress={() => console.log('hi')} style={{backgroundColor: buttonColor, color: 'black'}} size={20} color={'white'} />
            </View> */}
            { graphView === 'side' ?
                <Image source={require("../assets/images/side.png")} style={{width: 40, height: 40, marginBottom: -30}} />
            :
                <Image source={require("../assets/images/overhead.png")} style={{width: 40, height: 40, marginBottom: -30}} />
            }
            
            <Text style={{...styles.title, textAlign: 'center', marginLeft: 0}}>{graphView === 'side' ? 'Side View' : 'Overhead View'}</Text>
            <View style={{position: 'absolute', top: 70, left: -85, right: 400, bottom: 0, backgroundColor: 'transparent', zIndex: 100, width: 200}}> 
                <Text style={{fontSize: 14, color: 'white', zIndex: 100, transform: [{ rotate: '270deg'}]}}>{graphView === 'side' ? 'Vertical Position\n       (meters)' : 'Side Position\n    (meters)'}</Text>
            </View>
            <View style={{position: 'absolute', top: 195, left: 90, right: 0, bottom: 0, backgroundColor: 'transparent', zIndex: 100, width: 200, justifyContent: 'center', alignItems: 'center'}}> 
                <Text style={{fontSize: 14, color: 'white', zIndex: 100}}>{graphView === 'side' ? 'Horizontal Position (meters)' : 'Forward Position (meters)'}</Text>
            </View>

            <LineChart
                data={{
                    labels: xLabels,
                    datasets: [
                        {
                            color: () => `rgba(220, 220, 220, ${0.5})`,
                            data: yValues
                        }
                    ]
                }}
                width={Dimensions.get('window').width}
                height={200}
                yAxisLabel=""
                withShadow={false}
                yAxisSuffix=""
                verticalLabelRotation={90}
                xLabelsOffset={-16}
                yLabelsOffset={4}
                
                formatXLabel={(xValue: string) => parseFloat(xValue).toFixed(2).toString()}
                getDotColor={(dataPoint, index) => {
                    if (index === indexOfTime)
                        return '#ff0000'
                    else if (index === indexOfContact)
                        return '#00ff00'
                    return '#ffffff'
                }}
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#0a6fc2",
                    backgroundGradientTo: "#2196f3",
                    decimalPlaces: 2,
                    color: () => `rgba(255, 255, 255, ${0.3})`,
                    labelColor: () => `rgba(255, 255, 255, ${1})`,
                    propsForDots: {
                        r: "4"
                    },
                }}
                style={{
                    borderRadius: 20,
                    paddingBottom: 30
                }}
            />
            {/* { graphView === 'side' ?
                <Text style={{...styles.boldText, textAlign: 'center', marginTop: -15, marginBottom: 5}}>X: {Math.sqrt(positionPoints[indexOfTime].x**2 + positionPoints[indexOfTime].y**2).toFixed(2)}m   Y: {positionPoints[indexOfTime].z.toFixed(2)}m</Text>
                :
                <Text style={{...styles.boldText, textAlign: 'center', marginTop: -15, marginBottom: 5}}>X: {positionPoints[indexOfTime].x.toFixed(2)}m   Y: {positionPoints[indexOfTime].y.toFixed(2)}m</Text>
            } */}
        </View>
    );
}