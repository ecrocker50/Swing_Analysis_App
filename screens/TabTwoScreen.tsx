import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { BleManager, Characteristic } from 'react-native-ble-plx';
import { Button } from 'react-native';

const ble_Manager = new BleManager();
let characteristic: Characteristic | undefined = undefined;

export default function TabTwoScreen() {
    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>BLE</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

            <Button title={"Scan + Connect"} onPress={() => scanandConnect(ble_Manager)}></Button>
            <View style={styles.space_small} />
            <Button title={"Write Dummy Data"} onPress={() => writeData("XXYYZZ")}></Button>
            <View style={styles.space_small} />
            <Button title={"Read Dummy Data"} onPress={async () => console.log(await readData())}></Button>
        </View>
    );
}


const writeData = (dataToWrite: string): void => {
    if (characteristic !== undefined) {
        characteristic.writeWithoutResponse(dataToWrite);
    }
    else {
        console.log("ERROR - please connect first!");
    }
};


const readData = async (): Promise<string | null | undefined> => {
    if (characteristic !== undefined) {
        return (await characteristic.read()).value;
    }
    else {
        console.log("ERROR - please connect first!");
    }
};


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
            // connections++;
            // console.log(connections)
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

                characteristic = await device.readCharacteristicForService("000000ff-0000-1000-8000-00805f9b34fb", "0000ff01-0000-1000-8000-00805f9b34fb");
                // console.log((await characteristic1.read()).value);
                // while (true) {
                //     // buffer = new Buffer((await characteristic1.read()).value);
                //     // Buffer.from(, 'base64');

                //     console.log((await characteristic1.read()).value);

                // }
                // while (true)
                // await characteristic.writeWithoutResponse("XXYYZZ");


                return characteristic;
            })
            .catch((error) => {
                // Handle errors
                console.log("Oh no");
                return
            });

            return;
        }
    });
}