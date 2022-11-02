import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';


type IncrementCurrentTimeType = {
    incrementAmount: number;
    maximumSliderValue: number;
}

// default state that mode initializes to on app bootup
const initialState = {
    currentTimeSeconds: 0,      // the time that is currently selected to view by the user
};


// creates a slice for point in time. This contains all the actions and reducers used for hooking into the store
export const timeSlice = createSlice({
    name: 'time',
    initialState,
    reducers: {
        /** Sets the time that the user has selected to view **/
        REDUCER_SET_CURRENT_TIME_IN_STORE: (state, action: PayloadAction<number>) => {
            state.currentTimeSeconds = action.payload;
        },
        /** Increments time by an amount of seconds, passed in as a param. (will not increment if its at the endTime) **/
        REDUCER_INCREMENT_CURRENT_TIME_IN_STORE: (state, action: PayloadAction<IncrementCurrentTimeType>) => {
            if (state.currentTimeSeconds + action.payload.incrementAmount <= action.payload.maximumSliderValue) {
                state.currentTimeSeconds += action.payload.incrementAmount;
            }
            else {
                state.currentTimeSeconds = action.payload.maximumSliderValue;
            }
        },
        /** Decrements time by an amount of seconds, passed in as a param. (will not decrement if its at the 0) **/
        REDUCER_DECREMENT_CURRENT_TIME_IN_STORE: (state, action: PayloadAction<number>) => {
            if (state.currentTimeSeconds - action.payload >= 0) {
                state.currentTimeSeconds -= action.payload;
            }
            else {
                state.currentTimeSeconds = 0;
            }
        },
    }
});


// these are the actions we can dispatch
export const { REDUCER_SET_CURRENT_TIME_IN_STORE, REDUCER_INCREMENT_CURRENT_TIME_IN_STORE, REDUCER_DECREMENT_CURRENT_TIME_IN_STORE } = timeSlice.actions;

// these are the 'selectors' that are used to peek what the state.time contains
export const SELECTOR_CURRENT_TIME_SECONDS  = (state: RootState) => state.time.currentTimeSeconds;

// this is for configureStore()
export const timeReducer = timeSlice.reducer;