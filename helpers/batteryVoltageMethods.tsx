import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from '../components/Themed';
import * as React from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { REDUCER_SET_IS_BATTERY_REQUEST_TIMER_RUNNING } from '../store/batteryPercentageSlice';





/** Stops the battery voltage request timer. This will stop all requests for the battery voltage
 * 
 * @param dispatch The dispatch hook
 * @param batteryTimerRef The reference of the battery timer. This can be gotten from the SELECTOR_BATTERY_TIMER_REF selector in batteryPercentageSlice
 */
export const stopBatteryVoltageRequestTimer = (dispatch: Dispatch<AnyAction>, batteryTimerRef: NodeJS.Timer) => {
    clearInterval(batteryTimerRef);
    dispatch(REDUCER_SET_IS_BATTERY_REQUEST_TIMER_RUNNING(false));
};


/** Gets the battery percentage icon, not including text
 * 
 * @param percentLeft The percentage of the battery remaining
 * @returns JSX.Element - The icon to display for the battery percentage
 */
export const getBatteryPercentageIcon = (percentLeft: number): JSX.Element => {
    let componentName: any;
    let componentColor: string;

    if (percentLeft > 95) {
        componentName = 'battery';
        componentColor = 'green';
    } 
    else if (percentLeft > 90) {
        componentName = 'battery-90';
        componentColor = 'green';
    }
    else if (percentLeft > 80) {
        componentName = 'battery-80';
        componentColor = 'green';
    }
    else if (percentLeft > 70) {
        componentName = 'battery-70';
        componentColor = 'green';
    }
    else if (percentLeft > 60) {
        componentName = 'battery-60';
        componentColor = 'yellow';
    }
    else if (percentLeft > 50) {
        componentName = 'battery-50';
        componentColor = 'yellow';
    }
    else if (percentLeft > 40) {
        componentName = 'battery-40';
        componentColor = 'yellow';
    }
    else if (percentLeft > 30) {
        componentName = 'battery-30';
        componentColor = 'yellow';
    }
    else if (percentLeft > 20) {
        componentName = 'battery-20';
        componentColor = 'red';
    }
    else if (percentLeft > 10) {
        componentName = 'battery-10';
        componentColor = 'red';
    }
    else {
        componentName = 'battery-outline';
        componentColor = 'red';
    }

    componentColor = 'black';

    return <MaterialCommunityIcons name={componentName} color={componentColor} size={27} style={{marginRight: 10, marginTop: 10}} />;;
};


/** Gets the full battery percentage icon that appears in the top-right of the app.
 *  This includes botht the icon and the text
 * 
 * @param percentLeft The percentage of battery life remaining
 * @returns JSX.Element - The battery percentage component. Includes the percentage as text and the icon.
 */
export const getBatteryPercentageComponent = (percentLeft: number): JSX.Element => {

    return (
        <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 18, marginRight: 1, marginTop: 11}}>{percentLeft + '%'}</Text>
            { getBatteryPercentageIcon(percentLeft) }
        </View>
    );
};

