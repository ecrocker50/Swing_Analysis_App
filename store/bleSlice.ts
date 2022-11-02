import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';

// default state that mode initializes to on app bootup
const initialState: RootState['ble'] = {
    deviceId: '',
    deviceName:  'ESP_GATTS_DEMO'
};


// creates a slice for BLE. This contains all the actions and reducers used for hooking into the store
export const bleSlice = createSlice({
    name: 'ble',
    initialState,
    reducers: {
        /** Sets the device ID of the ble device to connect to */
        REDUCER_SET_DEVICE_ID: (state, action: PayloadAction<string>) => {
            state.deviceId = action.payload;
        },
        /** Sets the device name of the ble device to connect to*/
        REDUCER_SET_DEVICE_NAME: (state, action: PayloadAction<string>) => {
            state.deviceName = action.payload;
        }
    }
});


// these are the actions we can dispatch
export const { REDUCER_SET_DEVICE_ID, REDUCER_SET_DEVICE_NAME } = bleSlice.actions;

// these are 'selector's that is used to peek what the store contains
export const SELECTOR_DEVICE_ID    = (state: RootState) => state.ble.deviceId;
export const SELECTOR_DEVICE_NAME  = (state: RootState) => state.ble.deviceName;

// this is for configureStore()
export const bleReducer = bleSlice.reducer;