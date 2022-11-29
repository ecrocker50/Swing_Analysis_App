import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { TouchableOpacity } from 'react-native';
import { SingleDataPoint, UserSessionsData } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { SELECTOR_DEVICE_ID } from '../store/bleSlice';
import { scanAndStoreDeviceConnectionInfo } from '../bluetooth/methods';
import { getTimesOfAllPointsInSwing } from '../helpers/userDataMethods/userDataRead';
import React from 'react';
import { SELECTOR_IS_BATTERY_TIMER_RUNNING } from '../store/batteryPercentageSlice';

export default function Settings() {
    const dispatch = useDispatch();
    const deviceId = useSelector(SELECTOR_DEVICE_ID);
    const isBatteryTimerRunning = useSelector(SELECTOR_IS_BATTERY_TIMER_RUNNING);

    return (
        <View style={styles.topContainer}>
            <Text style={styles.titleCenterNoUnder}>BLE</Text>
            <View style={styles.separator}/>

            <View style={styles.space_small} />
            <Text style={styles.normalText}>{deviceId !== '' ? "Device found" : "Device not found"}</Text>
            <View style={styles.space_small} />

            <TouchableOpacity 
                style={styles.buttonRegular}
                onPress={() => scanAndStoreDeviceConnectionInfo(dispatch, isBatteryTimerRunning)} >
                    <Text style={styles.buttonText}>Search for Device</Text>
            </TouchableOpacity>

            <View style={styles.space_extra_large}></View>
            <View style={styles.space_extra_large}></View>

            
            <Text style={styles.titleCenterNoUnder}>Application Version</Text>
            <View style={styles.separator}/>
            <View style={styles.space_small} />
            <Text style={styles.normalText}>Version: 1.0.1</Text>

            
            {/*
            <View style={styles.space_small} />
            <Button title={"Write Mode Selection"} onPress={() => writeMode(deviceId, mode)}></Button>
            <View style={styles.space_small} />
            <Button 
                title={"Print data"} 
                onPress={() => 
                {printReceivedSwing(sessiondata)
            }} />
                                                                    
            <View style={styles.space_small} />
            <Button title={"End Session"} onPress={() => writeEndSession(deviceId)}></Button>
            <View style={styles.space_small} />
        */}
        </View>
    );
}


/** Prints out the received data in an easy to view format
 * 
 * @param data The array of data points received from the ESP32
 */
const printReceivedDataNice = (data: Array<SingleDataPoint>) => {
    data.forEach(element => {
        console.log(element);
    });

    if (data.length === 0) {
        console.log("No data");
    }
}

/** Prints out the received data in an easy to view format
 * 
 * @param data The array of data points received from the ESP32
 */
 const printReceivedSwing = (data: UserSessionsData) => {
    console.log(getTimesOfAllPointsInSwing(data, "Session Name", 0))
}


//userData: UserSessionsData, sessionName: string, swingIndex: number