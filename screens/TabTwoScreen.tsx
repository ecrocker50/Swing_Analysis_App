import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { BleManager } from 'react-native-ble-plx';

const ble_Manager = new BleManager();

export default function TabTwoScreen() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>BLE</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
        </View>
    );
}

const scanandConnect = (ble_Manager: BleManager) => {
    ble_Manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log("no connection")
            return
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device?.name === 'ESP_GATTS_DEMO') {
            
            // Stop scanning as it's not necessary if you are scanning for one device.
            ble_Manager.stopDeviceScan();

            // Proceed with connection.

            device.connect()
            .then((device) => {
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                // Do work on device with services and characteristics
                const characteristic1 = device.readCharacteristicForService("0x00FF", "0xFF01");
                console.log(characteristic1);
                return characteristic1;
            })
            .catch((error) => {
                // Handle errors
                console.log("Oh no");
                return
            });
        }
    });
}