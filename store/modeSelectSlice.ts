import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from '../types';

// default state that mode initializes to on app bootup
const initialState = {
    mode: 'forehand'
};


// creates a slice for modeSelect. This contains all the actions and reducers used for hooking into the store
export const modeSelectSlice = createSlice({
    name: 'modeSelect',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<State["modeSelect"]["mode"]>) => {
            state.mode = action.payload;
        },
    }
});


// these are the actions we can dispatch
export const { setMode } = modeSelectSlice.actions;

// this is a 'selector' that is used to peek what state.modeSelect.mode contains
export const selectMode = (state: State) => state.modeSelect.mode;

// this is for configureStore()
export const modeSelectReducer = modeSelectSlice.reducer;