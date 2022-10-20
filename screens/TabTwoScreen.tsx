import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { BleManager } from 'react-native-ble-plx';
import { Button } from 'react-native';

const ble_Manager = new BleManager();

export default function TabTwoScreen() {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>BLE</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/TabTwoScreen.tsx" />

        <Button title={"Scan + Connect"} onPress={() => scanandConnect(ble_Manager)}></Button>
        </View>
    );
}

const scanandConnect = (ble_Manager: BleManager) => {
    ble_Manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log("no connection")
            console.log(error)
            return
        }
        

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device?.name === 'ESP_GATTS_DEMO') {
            console.log("ESP_GATTS_DEMO")
            // Stop scanning as it's not necessary if you are scanning for one device.
            ble_Manager.stopDeviceScan();

            // Proceed with connection.

            device.connect()
            .then((device) => {
                console.log("try to discover all characteristics")
                return device.discoverAllServicesAndCharacteristics();
            })
            .then(async (device) => {
                // Do work on device with services and characteristics
                // const characteristic1 = device.readCharacteristicForService("0x00FF", "0xFF01");
                console.log("try to read characteristic")
                // const services = await device.services();
                // services.forEach(async service => {
                //     const characteristics = await device.characteristicsForService(service.uuid);
                //     characteristics.forEach((characteristic => {console.log(characteristic.uuid); console.log(characteristic.serviceUUID)}));
                // });

                const characteristic1 = await device.readCharacteristicForService("000000ee-0000-1000-8000-00805f9b34fb", "0000ee01-0000-1000-8000-00805f9b34fb");
                console.log((await characteristic1.read()).value);
                while (true) {
                    // buffer = new Buffer((await characteristic1.read()).value);
                    // Buffer.from(, 'base64');

                    console.log((await characteristic1.read()).value);

                }
                while (true)
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