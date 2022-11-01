import { BleManager, Characteristic } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Dispatch } from 'react';
import { Mode, SingleDataPoint, SingleSwing, UserSessionsData } from '../types';
import { setDeviceId } from '../store/bleSlice';
import { AnyAction } from '@reduxjs/toolkit';
import { addTimeOfContact, pushPointToSwing, pushSwingToSession } from '../store/swingDataSlice';
import { getSwingsInsideSession } from '../helpers/userDataMethods/userDataRead';

const WRITE_CHARACTERISTIC_SERVICE_UUID = '000000ee-0000-1000-8000-00805f9b34fb';
const WRITE_CHARACTERISTIC_UUID = "0000ee01-0000-1000-8000-00805f9b34fb";
const READ_CHARACTERISTIC_SERVICE_UUID = '000000ff-0000-1000-8000-00805f9b34fb';
const READ_CHARACTERISTIC_UUID = "0000ff01-0000-1000-8000-00805f9b34fb";


// This is our ble_manager object, nothing too special here
const ble_Manager = new BleManager();


/** Write the end of session instruction to the ESP32
 * 
 * @param deviceId The ID of the device to connect to. Generally you can find this in a selector in the bleSlice
 */
export const writeEndSession = async (deviceId: string): Promise<void> => {
    const writeCharacteristic = await connectToWriteCharacteristic(deviceId);

    let end_string = "DD"
    if (writeCharacteristic !== undefined) {
        writeCharacteristic.writeWithoutResponse(end_string);
    }
    else {
        console.log("ERROR - please connect first!");
    }
};



/** Write the current mode to the ESP32.
 * 
 * @param deviceId The ID of the device to connect to. Generally you can find this in a selector in the bleSlice
 * @param Mode The mode to write to the ESP32
 */
export const writeMode = async (deviceId: string, Mode: Mode): Promise<void> => {
    const writeCharacteristic = await connectToWriteCharacteristic(deviceId);

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
        console.log("ERROR - make sure the device info has been pushed to store!");
    }
};



/** Sends a read request to the ESP32. 
 * It then reads the data sent by the ESP32 that was stored in its storedData buffer.
 * 
 * @param deviceId The ID of the device to connect to. Generally you can find this in a selector in the bleSlice
 * @returns Promise<Array<SingleDataPoint>> - The array of SingleDataPoints that the ESP32 transmitted
 */
export const readData = async (deviceId: string, dispatch: Dispatch <AnyAction>, sessionName: string, userdata: UserSessionsData): Promise<void> =>  {
    const readCharacteristic = await connectToReadCharacteristic(deviceId);

    let arrayOfDataPoints: Array<SingleDataPoint> = [];

    if (readCharacteristic !== undefined) {
        // This is the string that will store all our hex values as one long string as we read them in
        let hexString: string = '';

        // Read in the first string of data 
        let newStringOfData = readCharacteristic.value;


        // Check to see if we received something
        if (newStringOfData === null) {
            // If we didn't get anything at all, save some time and just return right now
            return;
        }
        
        /*
           The BLE packet size limit is 600 bytes. If we exceed this, we need to perform multiple reads back to back.
           This block handles the reading of new data while there is new data being read in
        */
        while (newStringOfData !== null && newStringOfData !== '') {
            // Decode data from base64 to a string of hex digits
            const newBuffer = Buffer.from(newStringOfData, 'base64');
            const hexStringToAppend = newBuffer.toString('hex', 0, newBuffer.length);
            
            // Concatenate the new hex data to our hexString - this will grow with each new read
            hexString = hexString.concat(hexStringToAppend);

            // Read in the next string of data (Base64 encoded)
            newStringOfData = (await readCharacteristic.read()).value;
        }
        
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
        const swingArray = getSwingsInsideSession(userdata, sessionName)
        const swingIndex = swingArray.length
        dispatch(pushSwingToSession({sessionName: sessionName, swingToPush: {timeOfContact: 0, points: []}}))

        for (let i = 0; i < numOfBytes - 4; i += 32) {
            const singlePoint = {
                time: view.getInt32(i + 28, true) / 1000000, //might try 7 0s later
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
            dispatch(pushPointToSwing({sessionName: sessionName, swingIndex: swingIndex, dataPoint: singlePoint as SingleDataPoint}));
        }

        if (numOfBytes > 0) {
            dispatch(addTimeOfContact({sessionName, swingIndex, timeOfContact: view.getInt32(numOfBytes - 4, true) / 1000000}));
        }

        return;
    }
    else {
        console.log("ERROR - make sure the device info has been pushed to store!");
    }
};



/** Disconnects from the connected device. Don't think we need this now with the BLE refactor on 10/31
 * 
 * @param dispatch The dispatch hook
 */
export const disconnect = async (dispatch: Dispatch<AnyAction>) => {
    // ble_Manager.cancelDeviceConnection('ESP_GATTS_DEMO');
    const devices = await ble_Manager.connectedDevices(["000000ff-0000-1000-8000-00805f9b34fb"]);

    if (devices[0]?.id) {
        ble_Manager.cancelDeviceConnection(devices[0].id);
    }
};



/**
 * 
 * @param deviceId The ID of the device to connect to. Generally you can find this in a selector in the bleSlice
 * @returns Promise<Characteristic | undefined> - The characteristic that can write data to the ESP32. 
 */
export const connectToWriteCharacteristic = async (deviceId: string): Promise<Characteristic | undefined> => {
    if (deviceId === '') {
        return undefined;
    }

    let characteristic: Characteristic | undefined = undefined;
    let device;

    const connectedDevices = await ble_Manager.connectedDevices([WRITE_CHARACTERISTIC_SERVICE_UUID]);

    if (connectedDevices.length >= 1) {
        device = connectedDevices[0];
    }
    else {
        device = await ble_Manager.connectToDevice(deviceId);
    }


    if (device) {
        await device.discoverAllServicesAndCharacteristics().then(async (device) => {
            characteristic = await device.readCharacteristicForService(WRITE_CHARACTERISTIC_SERVICE_UUID, WRITE_CHARACTERISTIC_UUID);
        });
    }
    else {
        console.log("Device not found");
    }

    return characteristic;
};



/** Establishes a connection to the read characteristic. Using this, you can read values from the ESP32.
 * 
 * @param deviceId The ID of the device to connect to. Generally you can find this in a selector in the bleSlice
 * @returns Promise<Characteristic | undefined> - The characteristic that can read data from the ESP32. 
 * This already has the value in it, you don't have to call read() again, just call value on it to get the info
 */
const connectToReadCharacteristic = async (deviceId: string): Promise<Characteristic | undefined> => {
    if (deviceId === '') {
        return undefined;
    }

    let characteristic: Characteristic | undefined = undefined;
    let device;

    const connectedDevices = await ble_Manager.connectedDevices([READ_CHARACTERISTIC_SERVICE_UUID]);

    if (connectedDevices.length >= 1) {
        device = connectedDevices[0];
    }
    else {
        device = await ble_Manager.connectToDevice(deviceId);
    }


    if (device) {
        await device.discoverAllServicesAndCharacteristics().then(async (device) => {
            characteristic = await device.readCharacteristicForService(READ_CHARACTERISTIC_SERVICE_UUID, READ_CHARACTERISTIC_UUID);
        });
    }
    else {
        console.log("Device not found");
    }

    return characteristic;
};



/** Scans and stores the device's connection info. This tests to see if the connection is working and valid.
 *  Run this before ANY other BLE method!
 * 
 * @param dispatch The dispatch hook
 */
export const scanAndStoreDeviceConnectionInfo = async (dispatch: Dispatch<AnyAction>) => {
    ble_Manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log("no connection")
            console.log(error)
            return
        }

        // Check if it is a device you are looking for based on advertisement data or other criteria.
        if (device?.name === 'ESP_GATTS_DEMO') {
            // Stop scanning as it's not necessary if you are scanning for one device.
            ble_Manager.stopDeviceScan();

            // Proceed with connection.
            device.connect()
            .then((device) => {
                return device.discoverAllServicesAndCharacteristics();
            })
            .then(async (device) => {
                // Store the connection details of the device
                dispatch(setDeviceId(device.id));
            })
            .catch((error) => {
                // Handle errors
                console.log("BLE Connection Error:");
                console.log(error);
                return;
            });

            return;
        }
    });
};


