import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { BleManager, Characteristic } from 'react-native-ble-plx';
import { Button } from 'react-native';
import { Buffer } from 'buffer';
import { useState } from 'react';
import { Mode } from '../types';
import { useSelector } from 'react-redux';
import { selectMode } from '../store/modeSelectSlice';

const ble_Manager = new BleManager();

export default function TabTwoScreen() {
    const [characteristic, setCharacteristic] = useState<Characteristic | undefined>(undefined);
    const [mode_characteristic, set_mode_characteristic] = useState<Characteristic | undefined>(undefined);
    const mode = useSelector(selectMode)
    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>BLE</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

            <Text style={styles.title}>{characteristic !== undefined ? "Connected!" : "Not Connected!"}</Text>
            <View style={styles.space_large} />

            { characteristic !== undefined 
            ?
                <Button title={"Disconnect"} onPress={() => disconnect(setCharacteristic, ble_Manager)}></Button>
            :
                <Button title={"Connect"} onPress={() => scanandConnect(setCharacteristic, set_mode_characteristic, ble_Manager)}></Button>
            }
            <View style={styles.space_small} />
            <Button title={"Write Dummy Data"} onPress={() => writeData(mode_characteristic, mode)}></Button>
            <View style={styles.space_small} />

            
            <Button title={"Read Data"} onPress={async () => console.log(await readData(characteristic))}></Button>
        </View>
    );
}


const writeData = (mode_characteristic: Characteristic | undefined, Mode: Mode): void => {
    let mode_string = "EE"
    if(Mode === "Backhand"){
        mode_string = "AA";
    }
    else if(Mode === "Forehand"){
        mode_string = "BB";
    }
    else if(Mode === "Serve"){
        mode_string = "CC";
    }

    if (mode_characteristic !== undefined) {
        mode_characteristic.writeWithoutResponse(mode_string);
    }
    else {
        console.log("ERROR - please connect first!");
    }
};


/** Sends a read request to the ESP32. 
 * It then reads the data sent by the ESP32 that was stored in it's storedData buffer.
 * 
 * @param characteristic - the characteristic from which to read from
 * @returns Promise<Array<number> | undefined> - The array of floats that the ESP32 transmitted
 */
const readData = async (characteristic: Characteristic | undefined): Promise<Array<number> | undefined> => {
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

        
        // The data is coming in little endian format, so read 32 bits (4 bytes) at a time and convert to int32_t.
        // To convert to float, we simply divide by the same number we multiplied by on the ESP32 side (giving us 6 decimal precision)
        for (let i = 0; i < numOfBytes; i += 4) {
            floatArray.push(view.getInt32(i, true) / 1000000);
        }

        return floatArray;
    }
    else {
        console.log("ERROR - please connect first!");

        return undefined;
    }
};


const disconnect = async (setCharacteristic: React.Dispatch<React.SetStateAction<Characteristic | undefined>>, ble_Manager: BleManager) => {
    // ble_Manager.cancelDeviceConnection('ESP_GATTS_DEMO');
    try {
        const devices = await ble_Manager.connectedDevices(["000000ff-0000-1000-8000-00805f9b34fb"]);
        ble_Manager.cancelDeviceConnection(devices[0].id);
    }
    catch {
        // nothing!
    }


    setCharacteristic(undefined);
};

const scanandConnect = (setCharacteristic: React.Dispatch<React.SetStateAction<Characteristic | undefined>>, set_mode_characteristic: React.Dispatch<React.SetStateAction<Characteristic | undefined>>, ble_Manager: BleManager) => {
    

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

                const characteristic = await device.readCharacteristicForService("000000ff-0000-1000-8000-00805f9b34fb", "0000ff01-0000-1000-8000-00805f9b34fb");
                let mode_string = "3";
                setCharacteristic(characteristic);
                /*
                if(Mode === "Backhand"){
                    mode_string = "0";
                }
                else if(Mode === "Forehand"){
                    mode_string = "1";
                }
                else if(Mode === "Serve"){
                    mode_string = "2";
                }
                */
                const mode_characteristic = await device.readCharacteristicForService("000000ee-0000-1000-8000-00805f9b34fb", "0000ee01-0000-1000-8000-00805f9b34fb");
                if (mode_characteristic === undefined) {
                    console.log("mode_characteristic == undefined");
                }
                console.log(mode_characteristic.id);
                set_mode_characteristic(mode_characteristic);
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