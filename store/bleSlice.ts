import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';

// default state that mode initializes to on app bootup
const initialState: RootState['ble'] = {
    deviceId: '',
    deviceName:  'ESP_GATTS_DEMO',
    wasLastConnectAttemptSuccess: false
};


// creates a slice for BLE. This contains all the actions and reducers used for hooking into the store
export const bleSlice = createSlice({
    name: 'ble',
    initialState,
    reducers: {
        /** Sets the device ID of the ble device to connect to */
        REDUCER_SET_DEVICE_ID_IN_STORE: (state, action: PayloadAction<string>) => {
            state.deviceId = action.payload;
        },
        /** Sets the device name of the ble device to connect to*/
        REDUCER_SET_DEVICE_NAME_IN_STORE: (state, action: PayloadAction<string>) => {
            state.deviceName = action.payload;
        },
        /** Sets whether the last connection attempt was a success */
        REDUCER_SET_WAS_LAST_CONNECT_SUCCESS: (state, action: PayloadAction<boolean>) => {
            state.wasLastConnectAttemptSuccess = action.payload;
        }
    }
});


// these are the actions we can dispatch
export const { REDUCER_SET_DEVICE_ID_IN_STORE, REDUCER_SET_DEVICE_NAME_IN_STORE, REDUCER_SET_WAS_LAST_CONNECT_SUCCESS } = bleSlice.actions;

// these are 'selector's that is used to peek what the store contains
export const SELECTOR_DEVICE_ID    = (state: RootState) => state.ble.deviceId;
export const SELECTOR_DEVICE_NAME  = (state: RootState) => state.ble.deviceName;
export const SELECTOR_WAS_LAST_CONNECT_SUCCESS  = (state: RootState) => state.ble.wasLastConnectAttemptSuccess;

// this is for configureStore()
export const bleReducer = bleSlice.reducer;