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
        setDeviceId: (state, action: PayloadAction<string>) => {
            state.deviceId = action.payload;
        },
        /** Sets the device name of the ble device to connect to*/
        setDeviceName: (state, action: PayloadAction<string>) => {
            state.deviceName = action.payload;
        }
    }
});


// these are the actions we can dispatch
export const { setDeviceId, setDeviceName } = bleSlice.actions;

// these are 'selector's that is used to peek what the store contains
export const selectDeviceId    = (state: RootState) => state.ble.deviceId;
export const selectDeviceName  = (state: RootState) => state.ble.deviceName;

// this is for configureStore()
export const bleReducer = bleSlice.reducer;