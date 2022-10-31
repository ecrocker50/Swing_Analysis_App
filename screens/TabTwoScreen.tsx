import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { BleManager, Characteristic } from 'react-native-ble-plx';
import { Button } from 'react-native';
import { Buffer } from 'buffer';
import { useState } from 'react';
import { Mode, SingleDataPoint } from '../types';
import { useSelector } from 'react-redux';
import { selectMode } from '../store/modeSelectSlice';
import { resolvePlugin } from '@babel/core';

const ble_Manager = new BleManager();

export default function TabTwoScreen() {
    const [characteristic, setCharacteristic] = useState<Characteristic | undefined>(undefined);
    const [writeCharacteristic, set_writeCharacteristic] = useState<Characteristic | undefined>(undefined);
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
                <Button title={"Connect"} onPress={() => scanandConnect(setCharacteristic, set_writeCharacteristic, ble_Manager)}></Button>
            }
            <View style={styles.space_small} />
            <Button title={"Write Mode Selection"} onPress={() => writeMode(writeCharacteristic, mode)}></Button>
            <View style={styles.space_small} />
            <Button title={"Read Dummy Data"} onPress={async () => printReceivedDataNice(await readData(characteristic))}></Button>
            <View style={styles.space_small} />
            <Button title={"End Session"} onPress={() => writeEndSession(writeCharacteristic)}></Button>
            <View style={styles.space_small} />
        </View>
    );
}

const writeEndSession = (writeCharacteristic: Characteristic | undefined): void => {
    let end_string = "DD"
    if (writeCharacteristic !== undefined) {
        writeCharacteristic.writeWithoutResponse(end_string);
    }
    else {
        console.log("ERROR - please connect first!");
    }
}

const writeMode = (writeCharacteristic: Characteristic | undefined, Mode: Mode): void => {
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

    if (writeCharacteristic !== undefined) {
        writeCharacteristic.writeWithoutResponse(mode_string);
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
const readData = async (characteristic: Characteristic | undefined): Promise<Array<SingleDataPoint>> => {
    let arrayOfDataPoints: Array<SingleDataPoint> = [];

    if (characteristic !== undefined) {
        let data = (await characteristic.read()).value;

        if (data === null) {
            return [];
        }

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
        for (let i = 0; i < numOfBytes; i += 36) {
            const singlePoint = {
                time: view.getInt32(i+28, true) / 1000000,
                quaternion: {
                    real: view.getInt32(i+12, true) / 1000000,
                    i: view.getInt32(i+16, true) / 1000000,
                    j: view.getInt32(i+20, true) / 1000000,
                    k: view.getInt32(i+24, true) / 1000000,
                },
                position: {
                    x: view.getInt32(i, true) / 1000000,
                    y: view.getInt32(i+4, true) / 1000000,
                    z: view.getInt32(i+8, true) / 1000000,
                },
            }
            arrayOfDataPoints.push(singlePoint as SingleDataPoint);
        }
    }
    else {
        console.log("ERROR - please connect first!");
    }

    return arrayOfDataPoints;
};


const disconnect = async (setCharacteristic: React.Dispatch<React.SetStateAction<Characteristic | undefined>>, ble_Manager: BleManager) => {
    // ble_Manager.cancelDeviceConnection('ESP_GATTS_DEMO');
    const devices = await ble_Manager.connectedDevices(["000000ff-0000-1000-8000-00805f9b34fb"]);

    if (devices[0]?.id) {
        ble_Manager.cancelDeviceConnection(devices[0].id);
    }

    setCharacteristic(undefined);
};

const scanandConnect = (setCharacteristic: React.Dispatch<React.SetStateAction<Characteristic | undefined>>, set_writeCharacteristic: React.Dispatch<React.SetStateAction<Characteristic | undefined>>, ble_Manager: BleManager) => {
    

    ble_Manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log("no connection")
            console.log(error)
            return
        }
        

        // Check if it is a device you are looking for based on advertisement data or other criteria.
        if (device?.name === 'ESP_GATTS_DEMO') {
            console.log("ESP_GATTS_DEMO")
            // Stop scanning as it's not necessary if you are scanning for one device.
            ble_Manager.stopDeviceScan();

            // Proceed with connection.

            device.connect()
            .then((device) => {
                return device.discoverAllServicesAndCharacteristics();
            })
            .then(async (device) => {
                // Do work on device with services and characteristics

                const characteristic = await device.readCharacteristicForService("000000ff-0000-1000-8000-00805f9b34fb", "0000ff01-0000-1000-8000-00805f9b34fb");
                setCharacteristic(characteristic);
                
                const writeCharacteristic = await device.readCharacteristicForService("000000ee-0000-1000-8000-00805f9b34fb", "0000ee01-0000-1000-8000-00805f9b34fb");
                set_writeCharacteristic(writeCharacteristic);

                return characteristic;
            })
            .catch((error) => {
                // Handle errors
                console.log("BLE Connection Error:");
                console.log(error);
                return
            });

            return;
        }
    });
}




const printReceivedDataNice = (data: Array<SingleDataPoint>) => {
    data.forEach(element => {
        console.log(element);
    });

    if (data.length === 0) {
        console.log("No data");
    }
}