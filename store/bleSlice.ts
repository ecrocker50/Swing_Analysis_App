import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Characteristic } from 'react-native-ble-plx';
import { RootState } from '../types';

// default state that mode initializes to on app bootup
const initialState: RootState['ble'] = {
    writeCharacteristic: {} as Characteristic,
    readCharacteristic:  {} as Characteristic
};


// creates a slice for BLE. This contains all the actions and reducers used for hooking into the store
export const bleSlice = createSlice({
    name: 'ble',
    initialState,
    reducers: {
        /** Sets the write characteristic of ble*/
        setWriteCharacteristic: (state, action: PayloadAction<Characteristic>) => {
            state.writeCharacteristic = action.payload;
        },
        /** Sets the read characteristic of ble*/
        setReadCharacteristic: (state, action: PayloadAction<Characteristic>) => {
            state.readCharacteristic = action.payload;
        },
    }
});


// these are the actions we can dispatch
export const { setWriteCharacteristic, setReadCharacteristic } = bleSlice.actions;

// these are 'selector's that is used to peek what the store contains
export const selectWriteCharacteristic = (state: RootState) => state.ble.writeCharacteristic;
export const selectReadCharacteristic  = (state: RootState) => state.ble.readCharacteristic;

// this is for configureStore()
export const bleReducer = bleSlice.reducer;