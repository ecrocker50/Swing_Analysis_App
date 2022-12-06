import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mode, Quaternion, RootState } from '../types';

// default state that mode initializes to on app bootup
const initialState = {
    mode: 'Forehand',
    calibrated: false,
    quaternionCentered: {real: 0, i: 0, j: 0, k: 0},
};


// creates a slice for modeSelect. This contains all the actions and reducers used for hooking into the store
export const modeSelectSlice = createSlice({
    name: 'modeSelect',
    initialState,
    reducers: {
        /** Sets the current mode of swings (forehand, backhand, serve, etc) */
        REDUCER_SET_MODE_IN_STORE: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload;
        },
        REDUCER_SET_CALIBRATED_IN_STORE: (state, action: PayloadAction<boolean>) => {
            state.calibrated = action.payload;
        },
        REDUCER_SET_QUATERNION_CENTERED_IN_STORE: (state, action: PayloadAction<Quaternion>) => {
            state.quaternionCentered.real = action.payload.real;
            state.quaternionCentered.i    = action.payload.i;
            state.quaternionCentered.j    = action.payload.j;
            state.quaternionCentered.k    = action.payload.k;
        }
    }
});


// these are the actions we can dispatch
export const { REDUCER_SET_MODE_IN_STORE, REDUCER_SET_CALIBRATED_IN_STORE, REDUCER_SET_QUATERNION_CENTERED_IN_STORE } = modeSelectSlice.actions;

// this is a 'selector' that is used to peek what state.modeSelect.mode contains
export const SELECTOR_MODE       = (state: RootState) => state.modeSelect.mode;
export const SELECTOR_CALIBRATED = (state: RootState) => state.modeSelect.calibrated;
export const SELECTOR_QUATERNION_CENTERED = (state: RootState) => state.modeSelect.quaternionCentered;

// this is for configureStore()
export const modeSelectReducer = modeSelectSlice.reducer;