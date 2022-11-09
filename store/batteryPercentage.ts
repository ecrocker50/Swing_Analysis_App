import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';



// default state that mode initializes to on app bootup
const initialState = {
    batteryTimerRef: {},
    isBatteryTimerRunning: false,
    batteryPercent: 0
};


// creates a slice for batteryPercent. This contains all the actions and reducers used for hooking into the store
export const batteryPercentSlice = createSlice({
    name: 'batteryPercent',
    initialState,
    reducers: {
        /** Sets the current battery percent received from the device */
        REDUCER_SET_BATTERY_PERCENT: (state, action: PayloadAction<number>) => {
            state.batteryPercent = action.payload;
        },
        /** Sets whether the battery request timer is running */
        REDUCER_SET_IS_BATTERY_REQUEST_TIMER_RUNNING: (state, action: PayloadAction<boolean>) => {
            state.isBatteryTimerRunning = action.payload;
        },
        /** Gets the reference of the battery timer. Used to cancel the timer after it has started */
        REDUCER_SET_BATTER_TIMER_REF: (state, action: PayloadAction<NodeJS.Timer>) => {
            state.batteryTimerRef = action.payload;
        }
    }
});


// these are the actions we can dispatch
export const { REDUCER_SET_BATTERY_PERCENT, REDUCER_SET_IS_BATTERY_REQUEST_TIMER_RUNNING, REDUCER_SET_BATTER_TIMER_REF } = batteryPercentSlice.actions;

// this is a 'selector' that is used to peek what state.batteryPercent contains
export const SELECTOR_BATTERY_PERCENT          = (state: RootState) => state.batteryPercent.batteryPercent;
export const SELECTOR_IS_BATTERY_TIMER_RUNNING = (state: RootState) => state.batteryPercent.isBatteryTimerRunning;
export const SELECTOR_BATTERY_TIMER_REF        = (state: RootState) => state.batteryPercent.batteryTimerRef;

// this is for configureStore()
export const batteryPercentReducer = batteryPercentSlice.reducer;