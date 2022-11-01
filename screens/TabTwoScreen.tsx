import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { Button } from 'react-native';
import { SingleDataPoint } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectMode } from '../store/modeSelectSlice';
import { selectDeviceId } from '../store/bleSlice';
import { scanAndStoreDeviceConnectionInfo, writeMode, writeEndSession, readData } from '../bluetooth/methods';


export default function TabTwoScreen() {
    const dispatch = useDispatch();
    const mode = useSelector(selectMode);
    const deviceId = useSelector(selectDeviceId);

    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>BLE</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

            <Text style={styles.title}>{deviceId !== '' ? "Device found!" : "Device not found!"}</Text>
            <Button title={'Find Device'} onPress={() => scanAndStoreDeviceConnectionInfo(dispatch)}></Button>
            
            <View style={styles.space_small} />
            <Button title={"Write Mode Selection"} onPress={() => writeMode(deviceId, mode)}></Button>
            <View style={styles.space_small} />
            <Button title={"Read Dummy Data"} onPress={async () => printReceivedDataNice(await readData(deviceId))}></Button>
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