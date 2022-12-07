import React, { useState, useEffect } from 'react';
import { Button, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { buttonCyan, buttonGreen, buttonMagenta, styles } from '../styles';
import { readPointData, writeEndSession, startBatteryVoltageRequestTimer, calibrate } from '../bluetooth/methods';
import { useDispatch, useSelector } from 'react-redux';
import { SELECTOR_DEVICE_ID } from '../store/bleSlice';
import { SELECTOR_USER_SESSIONS } from '../store/swingDataSlice';
import { getLastAddedSessionName, getModeOfSession, getSwingsInsideSession } from '../helpers/userDataMethods/userDataRead';
import { stopBatteryVoltageRequestTimer } from '../helpers/batteryVoltageMethods';
import { SELECTOR_CALIBRATED } from '../store/modeSelectSlice';




export default function CalibrationScreen({ navigation }: RootStackScreenProps<'Calibration'>) {
    const dispatch = useDispatch();
    const deviceId = useSelector(SELECTOR_DEVICE_ID);
    const isCalibrated = useSelector(SELECTOR_CALIBRATED);

    let wasCalibratedRight: boolean | undefined | null = null;


    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>Calibrate the Device</Text>
            <View style={styles.space_small}></View>

            <View style={styles.jumbotron_gray}>

                <Text style={styles.normalText}>Calibrating the device ensures the proper orientation of all graphs and data.</Text>

                <View style={styles.space_small}></View>

                <Text style={styles.normalText}>Please place the device on the ground with the webbing of the racket facing the direction the tennis balls will come from.</Text>

                <View style={styles.space_small}></View>

                <Text style={styles.normalText}>Once the racket is stationary, press the Calibrate button below.</Text>
            </View>


            <View style={styles.space_medium}></View>

            <TouchableOpacity 
                style={styles.buttonRegular}
                onPress={async () => {
                    wasCalibratedRight = await calibrate(dispatch, deviceId);
                }} >
                    <Text style={styles.buttonText}>Calibrate</Text>
            </TouchableOpacity>

            <View style={styles.space_medium}></View>

            { isCalibrated ?
                <Text style={styles.normalText}>Device calibrated</Text>
                :
                wasCalibratedRight === false ?
                    <Text style={styles.errorText}>Turn Device Upside Down</Text>
                    : 
                    null
            }


            
        </View>
    );
}





