import React from 'react';
import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Platform } from 'react-native';

import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { convertMillisToSeconds} from '../helpers/numberConversions';
import { getMaxTimeOfSwing, getPosition, getQuaternions, getTimeOfContact } from '../helpers/userDataHelpers';
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
                onValueChange={(value) => dispatch(setCurrentTime(value))}
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