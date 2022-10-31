import React, { Dispatch } from 'react';
import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Platform } from 'react-native';
import { AnyAction } from '@reduxjs/toolkit';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { convertMillisToSeconds} from '../helpers/numberConversions';
import { getMaxTimeOfSwing, getPosition, getQuaternions, getTimeOfContact, getTimesOfAllPointsInSwing } from '../helpers/userDataHelpers';
import {
    setCurrentTime,
    selectCurrentTimeMilliseconds, 
} from '../store/timeSlice';
import {
    selectSelectedSession,
    selectSelectedSwing, 
    selectUserSessions
} from '../store/swingDataSlice';



export default function ModalScreen() {
    const dispatch = useDispatch();
    const currentTimeMS   = useSelector(selectCurrentTimeMilliseconds);
    const selectedSession = useSelector(selectSelectedSession);
    const selectedSwing   = useSelector(selectSelectedSwing);
    const userSessions    = useSelector(selectUserSessions);
    
    const allSwingTimePoints = getTimesOfAllPointsInSwing(userSessions, selectedSession, selectedSwing);

    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>Swing Visualization</Text>
            <View style={styles.lineUnderTitle}/>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />


        
            <View style={styles.space_extra_large}/>

            <Text style={styles.title}>
                Current Time: {convertMillisToSeconds(currentTimeMS).toFixed(3)}s
            </Text>

            <Slider 
                style={styles.slider} 
                onValueChange={(value) => correctSliderValueAndSetStore(dispatch, value, allSwingTimePoints)}//dispatch(setCurrentTime(parseInt(value.toString())))}
                maximumValue={getMaxTimeOfSwing(userSessions, selectedSession, selectedSwing)}
                minimumValue={0}
            />

            <Text style={styles.normalText}>Session: {selectedSession}</Text>
            <Text style={styles.normalText}>Swing:   {selectedSwing}</Text>

            <Text style={styles.normalText}>Time of Contact: {getTimeOfContact(userSessions, selectedSession, selectedSwing)}ms</Text>
            <Text style={styles.normalText}>Quaternion real:   {getQuaternions(userSessions, selectedSession, selectedSwing, currentTimeMS).real}</Text>
            <Text style={styles.normalText}>Quaternion i:   {getQuaternions(userSessions, selectedSession, selectedSwing, currentTimeMS).i}</Text>
            <Text style={styles.normalText}>Quaternion j:   {getQuaternions(userSessions, selectedSession, selectedSwing, currentTimeMS).j}</Text>
            <Text style={styles.normalText}>Quaternion k:   {getQuaternions(userSessions, selectedSession, selectedSwing, currentTimeMS).k}</Text>
            <Text style={styles.normalText}>Position x:   {getPosition(userSessions, selectedSession, selectedSwing, currentTimeMS).x}</Text>
            <Text style={styles.normalText}>Position y:   {getPosition(userSessions, selectedSession, selectedSwing, currentTimeMS).y}</Text>
            <Text style={styles.normalText}>Position z:   {getPosition(userSessions, selectedSession, selectedSwing, currentTimeMS).z}</Text>
        </View>
    );
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

    dispatch(setCurrentTime(parseInt(newValue.toString())))
};