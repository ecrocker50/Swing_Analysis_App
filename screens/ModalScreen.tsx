import React from 'react';
import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Platform } from 'react-native';

import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { convertMillisToSeconds} from '../helpers/numberConversions';
import { getMaxTimeOfSwing, getTimeOfContact } from '../helpers/userDataHelpers';
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


        </View>
    );
}