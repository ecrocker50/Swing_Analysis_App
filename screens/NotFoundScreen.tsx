import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { styles } from '../styles';
import { readData } from '../bluetooth/methods';
import { useDispatch, useSelector } from 'react-redux';
import { SELECTOR_DEVICE_ID } from '../store/bleSlice';
import { SELECTOR_USER_SESSIONS } from '../store/swingDataSlice';
import { getSwingsInsideSession } from '../helpers/userDataMethods/userDataRead';


export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    const dispatch = useDispatch();
    const [numOfSwings, setNumOfSwings] = useState<number>(0);

    const deviceId = useSelector(SELECTOR_DEVICE_ID);
    const sessiondata = useSelector(SELECTOR_USER_SESSIONS);

    // The glorious useEffect hook, which runs when this component is mounted
    useEffect(() => {

        // This is our timer for reading data from the ESP32
        let dataReadTimerID = setInterval(() => {
            console.log("timer fired");

            if (deviceId != '') {
                readData(deviceId, dispatch, "Session Name", sessiondata); 
            }
        }, 500);

        // The return from the useEffect is special. It only returns when the component is unmounted
        return () => clearInterval(dataReadTimerID);

    }, []); // <-- looky here, an empty array as the second param. That's the dependency list. If it's empty, useEffect will only run once.

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Session in progress.</Text>
            <View style={styles.space_medium}></View>

            <Text style={styles.normalText}>Number of swings recorded: {0}</Text>

            <View style={styles.space_medium}></View>

            <Button title="End Session" onPress={() => navigation.navigate('Root')} />
        </View>
    );
}



