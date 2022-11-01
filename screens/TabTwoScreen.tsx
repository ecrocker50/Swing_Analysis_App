import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { Button } from 'react-native';
import { SingleDataPoint, SingleSession, SingleSwing, UserSessionsData } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectMode } from '../store/modeSelectSlice';
import { selectDeviceId } from '../store/bleSlice';
import { scanAndStoreDeviceConnectionInfo, writeMode, writeEndSession, readData } from '../bluetooth/methods';
import { getTimesOfAllPointsInSwing } from '../helpers/userDataMethods/userDataRead';
import { selectUserSessions } from '../store/swingDataSlice';

export default function TabTwoScreen() {
    const dispatch = useDispatch();
    const mode = useSelector(selectMode);
    const deviceId = useSelector(selectDeviceId);
    const sessiondata = useSelector(selectUserSessions)

    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>BLE</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

            <Text style={styles.title}>{deviceId !== '' ? "Device found!" : "Device not found!"}</Text>
            <Button title={'Find Device'} onPress={() => scanAndStoreDeviceConnectionInfo(dispatch)}></Button>
            
            <View style={styles.space_small} />
            <Button title={"Write Mode Selection"} onPress={() => writeMode(deviceId, mode)}></Button>
            <View style={styles.space_small} />
            <Button title={"Read Dummy Data"} onPress={async () => {await readData(deviceId, dispatch, "Session Name", sessiondata); 
                                                                    printReceivedSwing(sessiondata)
                                                                    }}></Button>
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