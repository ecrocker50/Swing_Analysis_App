import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { styles } from '../styles';
import { readPointData, writeEndSession, startBatteryVoltageRequestTimer } from '../bluetooth/methods';
import { useDispatch, useSelector } from 'react-redux';
import { SELECTOR_DEVICE_ID } from '../store/bleSlice';
import { SELECTOR_USER_SESSIONS } from '../store/swingDataSlice';
import { getLastAddedSessionName, getSwingsInsideSession } from '../helpers/userDataMethods/userDataRead';
import { stopBatteryVoltageRequestTimer } from '../helpers/batteryVoltageMethods';
import { SELECTOR_BATTERY_TIMER_REF } from '../store/batteryPercentageSlice';




export default function SessionInProgressScreen({ navigation }: RootStackScreenProps<'SessionInProgress'>) {
    const dispatch = useDispatch();
    const deviceId = useSelector(SELECTOR_DEVICE_ID);
    const userSessions = useSelector(SELECTOR_USER_SESSIONS);
    const battTimerRef = useSelector(SELECTOR_BATTERY_TIMER_REF);
    const [tryReadESP32, setTryReadESP32] = useState<boolean>(true);


    // Gets the last added session in userSessions. This is Sean's cheap way of getting the current session name without adding a var to keep track of it in store :)
    const lastAddedSessionName = getLastAddedSessionName(userSessions);

    let intervalId: NodeJS.Timer;

    

    // The glorious useEffect hook, which runs when this component is mounted
    useEffect(() => {
        stopBatteryVoltageRequestTimer(dispatch, battTimerRef);

        // This is our timer for reading data from the ESP32
        intervalId = setInterval(() => { // <-- setInterval is a special React Expo function. It sets up a timer and runs the contents after 500 milliseconds in this case
            // console.log("data point timer fired");
            console.log(deviceId);
            console.log(tryReadESP32)

            if (deviceId != '' && tryReadESP32) {
                // don't want to trigger another read if we're in the middle of a read, so set this to false
                setTryReadESP32(false);
                console.log('try');
                // try reading from the ESP32
                readPointData(deviceId, dispatch, lastAddedSessionName, userSessions).then(() => {  
                    // wait until done with this read to open up reading to the timer again
                    setTryReadESP32(true);
                    console.log('did read pt data');
                }).catch(() => {
                    setTryReadESP32(true);
                    console.log('FAILED read pt data');
                }); 
            }
        }, 1500);

        // returns from a useEffect are special. They only fire on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [userSessions, tryReadESP32]); 



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Session in progress.</Text>
            <View style={styles.space_medium}></View>

            <Text style={styles.normalText}>Number of swings recorded: {getSwingsInsideSession(userSessions, lastAddedSessionName).length}</Text>

            <View style={styles.space_medium}></View>

            <Button title="End Session" onPress={() => {
                startBatteryVoltageRequestTimer(dispatch, false, deviceId);
                writeEndSession(deviceId)
                navigation.navigate('Root')}} />
        </View>
    );
}





