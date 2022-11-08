import React, { useState, useEffect, Dispatch } from 'react';
import { Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { Mode, RootStackScreenProps, UserSessionsData } from '../types';
import { styles } from '../styles';
import { readData, writeEndSession } from '../bluetooth/methods';
import { useDispatch, useSelector } from 'react-redux';
import { SELECTOR_DEVICE_ID } from '../store/bleSlice';
import { SELECTOR_USER_SESSIONS } from '../store/swingDataSlice';
import { getLastAddedSessionName, getSwingsInsideSession } from '../helpers/userDataMethods/userDataRead';
import { AnyAction } from '@reduxjs/toolkit';




export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const dispatch = useDispatch();
    const deviceId = useSelector(SELECTOR_DEVICE_ID);
    const userSessions = useSelector(SELECTOR_USER_SESSIONS);
    const [tryReadESP32, setTryReadESP32] = useState<boolean>(true);


    // Gets the last added session in userSessions. This is Sean's cheap way of getting the current session name without adding a var to keep track of it in store :)
    const lastAddedSessionName = getLastAddedSessionName(userSessions);

    

    // The glorious useEffect hook, which runs when this component is mounted
    useEffect(() => {
        // This is our timer for reading data from the ESP32
        const intervalId = setInterval(() => { // <-- setInterval is a special React Expo function. It sets up a timer and runs the contents after 500 milliseconds in this case
            console.log("timer fired");

            if (deviceId != '' && tryReadESP32) {
                // don't want to trigger another read if we're in the middle of a read, so set this to false
                setTryReadESP32(false);

                // try reading from the ESP32
                readData(deviceId, dispatch, lastAddedSessionName, userSessions).then(() => {  
                    // wait until done with this read to open up reading to the timer again
                    setTryReadESP32(true);
                }); 
            }

        }, 500);

        // returns from a useEffect are special. They only fire on component unmount
        return () => clearInterval(intervalId);
    }, [userSessions]); 



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Session in progress.</Text>
            <View style={styles.space_medium}></View>

            <Text style={styles.normalText}>Number of swings recorded: {getSwingsInsideSession(userSessions, lastAddedSessionName).length}</Text>

            <View style={styles.space_medium}></View>

            <Button title="End Session" onPress={() => {
                writeEndSession(deviceId)
                navigation.navigate('Root')}} />
        </View>
    );
}





