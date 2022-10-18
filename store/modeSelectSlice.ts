import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';

// default state that mode initializes to on app bootup
const initialState = {
    mode: 'Forehand'
};


// creates a slice for modeSelect. This contains all the actions and reducers used for hooking into the store
export const modeSelectSlice = createSlice({
    name: 'modeSelect',
    initialState,
    reducers: {
        /** Sets the current mode of swings (forehand, backhand, serve, etc) */
        setMode: (state, action: PayloadAction<RootState["modeSelect"]["mode"]>) => {
            state.mode = action.payload;
        },
    }
});


// these are the actions we can dispatch
export const { setMode } = modeSelectSlice.actions;

// this is a 'selector' that is used to peek what state.modeSelect.mode contains
export const selectMode = (state: RootState) => state.modeSelect.mode;

// this is for configureStore()
export const modeSelectReducer = modeSelectSlice.reducer;