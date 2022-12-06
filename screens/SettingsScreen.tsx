import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { TouchableOpacity } from 'react-native';
import { SingleDataPoint, UserSessionsData, Handedness } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { SELECTOR_DEVICE_ID } from '../store/bleSlice';
import { scanAndStoreDeviceConnectionInfo } from '../bluetooth/methods';
import { getTimesOfAllPointsInSwing } from '../helpers/userDataMethods/userDataRead';
import React, { useState } from 'react';
import { SELECTOR_IS_BATTERY_TIMER_RUNNING } from '../store/batteryPercentageSlice';
import { useNavigation } from '@react-navigation/native';
import { SELECTOR_CALIBRATED, SELECTOR_QUATERNION_CENTERED, REDUCER_SET_HANDEDNESS_IN_STORE } from '../store/modeSelectSlice';
import { THREE } from 'expo-three';
import DropDownPicker from 'react-native-dropdown-picker';



const HandOptionsMap: Array<object> = [{label: "Left", value: "Left"}, {label: "Right", value: "Right"}];


export default function Settings() {
    const dispatch = useDispatch();
    const deviceId = useSelector(SELECTOR_DEVICE_ID);
    const calibrated = useSelector(SELECTOR_CALIBRATED);
    const isBatteryTimerRunning = useSelector(SELECTOR_IS_BATTERY_TIMER_RUNNING);
    const navigation = useNavigation();
    const calibratedQuaternion = useSelector(SELECTOR_QUATERNION_CENTERED);
    const [isDropDownOpen, setIsDropDownOpenOpen] = useState(false);
    const [selectedHandLocal, setSelectedHandLocal] = useState<Handedness>("Right");

    
    const quaternionToSet = new THREE.Quaternion(calibratedQuaternion.i, calibratedQuaternion.j, calibratedQuaternion.k, calibratedQuaternion.real);

    const euler = new THREE.Euler().setFromQuaternion(quaternionToSet);

    dispatch(REDUCER_SET_HANDEDNESS_IN_STORE(selectedHandLocal));

    return (
        <View style={styles.topContainer}>
            <Text style={styles.titleCenterNoUnder}>BLE</Text>
            <View style={styles.separator}/>

            <View style={styles.space_small} />
            <Text style={styles.normalText}>{deviceId !== '' ? "Device found" : "Device not found"}</Text>
            <View style={styles.space_small} />

            <TouchableOpacity 
                style={styles.buttonRegular}
                onPress={() => scanAndStoreDeviceConnectionInfo(dispatch, isBatteryTimerRunning)} >
                    <Text style={styles.buttonText}>Search for Device</Text>
            </TouchableOpacity>


            <View style={styles.space_medium}></View>


            <Text style={styles.titleCenterNoUnder}>Calibration</Text>
            <View style={styles.separator}/>

            <View style={styles.space_small} />
            <Text style={styles.normalText}>{calibrated ? "Device calibrated" : "Device not calibrated"}</Text>
            <Text style={styles.normalText}>x: {euler.x} y: {euler.y} z: {euler.z}</Text>
            
            <View style={styles.space_small} />

            <TouchableOpacity 
                style={styles.buttonRegular}
                onPress={() =>  navigation.navigate('Calibration') }>
                    <Text style={styles.buttonText}>Calibrate Device</Text>
            </TouchableOpacity>

            <View style={styles.space_medium}></View>


            <Text style={styles.titleCenterNoUnder}>Handedness</Text>
            <View style={styles.separator}/>
            <View style={styles.space_small} />
            <DropDownPicker
                open={isDropDownOpen}
                value={selectedHandLocal}
                items={HandOptionsMap}
                setOpen={setIsDropDownOpenOpen}
                setValue={setSelectedHandLocal}
                closeAfterSelecting={true}
                closeOnBackPressed={true}
                style={styles.dropdown}
                textStyle={styles.normalText}
                placeholderStyle={styles.normalText}
                dropDownContainerStyle={styles.dropdown}
                listItemLabelStyle={styles.normalText}
                dropDownDirection={"BOTTOM"}
                />

            <View style={styles.space_medium}></View>
            
            <Text style={styles.titleCenterNoUnder}>Application Version</Text>
            <View style={styles.separator}/>
            <View style={styles.space_small} />
            <Text style={styles.normalText}>Version: 1.0.1</Text>

            
            {/*
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
        */}
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