import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { Button } from 'react-native';
import { SingleDataPoint, UserSessionsData } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { SELECTOR_MODE } from '../store/modeSelectSlice';
import { SELECTOR_DEVICE_ID } from '../store/bleSlice';
import { scanAndStoreDeviceConnectionInfo, writeMode, writeEndSession, readPointData } from '../bluetooth/methods';
import { getTimesOfAllPointsInSwing } from '../helpers/userDataMethods/userDataRead';
import { SELECTOR_USER_SESSIONS } from '../store/swingDataSlice';
import React from 'react';
import { SELECTOR_IS_BATTERY_TIMER_RUNNING } from '../store/batteryPercentageSlice';

export default function Settings() {
    //const [inputtedHand, setInputtedHand] = useState<string>("");
    const dispatch = useDispatch();
    const mode = useSelector(SELECTOR_MODE);
    const deviceId = useSelector(SELECTOR_DEVICE_ID);
    const sessiondata = useSelector(SELECTOR_USER_SESSIONS)
    const isBatteryTimerRunning = useSelector(SELECTOR_IS_BATTERY_TIMER_RUNNING);

    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>BLE</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

            <View style={styles.space_small} />

            <View style={styles.space_small} />
            <Text style={styles.title}>{deviceId !== '' ? "Device found!" : "Device not found!"}</Text>
            <Button title={'Reconnect BLE'} onPress={() => scanAndStoreDeviceConnectionInfo(dispatch, isBatteryTimerRunning)}></Button>
            
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