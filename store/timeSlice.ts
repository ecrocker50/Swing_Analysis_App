import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../types';


type IncrementCurrentTimeType = {
    incrementAmount: number;
    maximumSliderValue: number;
}

// default state that mode initializes to on app bootup
const initialState = {
    currentTimeMilliseconds: 0,      // the time that is currently selected to view by the user
};


// creates a slice for point in time. This contains all the actions and reducers used for hooking into the store
export const timeSlice = createSlice({
    name: 'time',
    initialState,
    reducers: {
        /** Sets the time that the user has selected to view **/
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTimeMilliseconds = action.payload;
        },
        /** Increments time by an amount of milliseconds, passed in as a param. (will not increment if its at the endTime) **/
        incrementCurrentTime: (state, action: PayloadAction<IncrementCurrentTimeType>) => {
            if (state.currentTimeMilliseconds + action.payload.incrementAmount <= action.payload.maximumSliderValue) {
                state.currentTimeMilliseconds += action.payload.incrementAmount;
            }
            else {
                state.currentTimeMilliseconds = action.payload.maximumSliderValue;
            }
        },
        /** Decrements time by an amount of milliseconds, passed in as a param. (will not decrement if its at the 0) **/
        decrementCurrentTime: (state, action: PayloadAction<number>) => {
            if (state.currentTimeMilliseconds - action.payload >= 0) {
                state.currentTimeMilliseconds -= action.payload;
            }
            else {
                state.currentTimeMilliseconds = 0;
            }
        },
    }
});


// these are the actions we can dispatch
export const { setCurrentTime, incrementCurrentTime, decrementCurrentTime } = timeSlice.actions;

// these are the 'selectors' that are used to peek what the state.time contains
export const selectCurrentTimeMilliseconds  = (state: RootState) => state.time.currentTimeMilliseconds;

// this is for configureStore()
export const timeReducer = timeSlice.reducer;