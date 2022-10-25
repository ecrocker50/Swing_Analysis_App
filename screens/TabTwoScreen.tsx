import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { BleManager, Characteristic } from 'react-native-ble-plx';
import { Button } from 'react-native';
import { Buffer } from 'buffer';

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


/** Sends a read request to the ESP32. 
 * It then reads the data sent by the ESP32 that was stored in it's storedData buffer.
 * 
 * @returns Promise<Array<number> | undefined> - The array of floats that the ESP32 transmitted
 */
const readData = async (): Promise<Array<number> | undefined> => {
    if (characteristic !== undefined) {
        let data = (await characteristic.read()).value;

        if (data === null) {
            return undefined;
        }

        const floatArray: Array<number> = [];

        // Decode data from base64 to a string of hex digits
        const buff = Buffer.from(data, 'base64');
        const hexString = buff.toString('hex');
        
        // The number of bytes is two times less than the number of digits in the hex string
        const stringLen = hexString.length;
        const numOfBytes = stringLen / 2;

        // Match any two digits with the regex. This separates it into an array of bytes instead of one long string
        const bytes: Array<string> | null = hexString.match(/../g);

        // Create the data view, which will hold and manipulate our stored data
        const arrayBuff = new ArrayBuffer(stringLen);
        const view = new DataView(arrayBuff);

        // Populate the data view by converting each hex byte to a uint8_t
        bytes?.forEach((value, index) => {
            const int = parseInt(value, 16);
            view.setUint8(index, int);
        });

        
        // The data is coming in little endian format, so read 32 bits (4 bytes) at a time and convert to uint32_t.
        // To convert to float, we simply divide by the same number we multiplied by on the ESP32 side (giving us 6 decimal precision)
        for (let i = 0; i < numOfBytes; i += 4) {
            floatArray.push(view.getUint32(i, true) / 1000000);
        }

        return floatArray;
    }
    else {
        console.log("ERROR - please connect first!");

        return undefined;
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