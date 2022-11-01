import React, { Dispatch } from 'react';
import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Platform } from 'react-native';
import { AnyAction } from '@reduxjs/toolkit';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { getMaxTimeOfSwing, getPosition, getQuaternion, getTimeOfContact, getTimesOfAllPointsInSwing } from '../helpers/userDataMethods/userDataRead';
import {
    setCurrentTime,
    selectCurrentTimeSeconds, 
} from '../store/timeSlice';
import {
    selectSelectedSession,
    selectSelectedSwing, 
    selectUserSessions
} from '../store/swingDataSlice';



export default function SwingVisualizeScreen() {
    const dispatch = useDispatch();
    const currentTimeSeconds   = useSelector(selectCurrentTimeSeconds);
    const selectedSession = useSelector(selectSelectedSession);
    const selectedSwing   = useSelector(selectSelectedSwing);
    const userSessions    = useSelector(selectUserSessions);
    
    const allSwingTimePoints = getTimesOfAllPointsInSwing(userSessions, selectedSession, selectedSwing);
    const maxSwingValue = getMaxTimeOfSwing(userSessions, selectedSession, selectedSwing);

    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>Swing Visualization</Text>
            <View style={styles.lineUnderTitle}/>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

        
            <View style={styles.space_extra_large}/>

            <Text style={styles.title}>
                Current Time: {currentTimeSeconds.toFixed(6)}s
            </Text>

            <Slider 
                style={styles.slider} 
                onValueChange={(value) => correctSliderValueAndSetStore(dispatch, value, allSwingTimePoints)}
                maximumValue={maxSwingValue}
                minimumValue={0}
            />

            <Text style={styles.normalText}>Session: {selectedSession}</Text>
            <Text style={styles.normalText}>Swing:   {selectedSwing}</Text>

            <Text style={styles.normalText}>Time of Contact: {getTimeOfContact(userSessions, selectedSession, selectedSwing)}s</Text>
            <Text style={styles.normalText}>Quaternion real:   {getQuaternion(userSessions, selectedSession, selectedSwing, currentTimeSeconds).real}</Text>
            <Text style={styles.normalText}>Quaternion i:   {getQuaternion(userSessions, selectedSession, selectedSwing, currentTimeSeconds).i}</Text>
            <Text style={styles.normalText}>Quaternion j:   {getQuaternion(userSessions, selectedSession, selectedSwing, currentTimeSeconds).j}</Text>
            <Text style={styles.normalText}>Quaternion k:   {getQuaternion(userSessions, selectedSession, selectedSwing, currentTimeSeconds).k}</Text>
            <Text style={styles.normalText}>Position x:   {getPosition(userSessions, selectedSession, selectedSwing, currentTimeSeconds).x}</Text>
            <Text style={styles.normalText}>Position y:   {getPosition(userSessions, selectedSession, selectedSwing, currentTimeSeconds).y}</Text>
            <Text style={styles.normalText}>Position z:   {getPosition(userSessions, selectedSession, selectedSwing, currentTimeSeconds).z}</Text>
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

    dispatch(setCurrentTime(parseFloat(newValue.toFixed(6))));
};