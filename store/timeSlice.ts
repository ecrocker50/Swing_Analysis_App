import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from '../types';

// default state that mode initializes to on app bootup
const initialState = {
    endTimeMilliseconds: 0,          // the ending time of the swing
    currentTimeMilliseconds: 0,      // the time that is currently selected to view by the user
    timeOfImpactMilliseconds: 0,     // the time of impact with the ball
};


// creates a slice for point in time. This contains all the actions and reducers used for hooking into the store
export const timeSlice = createSlice({
    name: 'time',
    initialState,
    reducers: {
        /** Sets the time of impact with the ball **/ 
        setTimeOfImpact: (state, action: PayloadAction<number>) => {
            state.timeOfImpactMilliseconds = action.payload;
        },
        /** Sets the time that the user has selected to view **/
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTimeMilliseconds = action.payload;
        },
        /** Sets the ending time of the swing (used as an upper bound of time) **/
        setEndTime: (state, action: PayloadAction<number>) => {
            state.endTimeMilliseconds = action.payload;
        },
        /** Increments time by an amount of milliseconds, passed in as a param. (will not increment if its at the endTime) **/
        incrementCurrentTime: (state, action: PayloadAction<number>) => {
            if (state.currentTimeMilliseconds + action.payload <= state.endTimeMilliseconds) {
                state.currentTimeMilliseconds += action.payload;
            }
            else {
                state.currentTimeMilliseconds = state.endTimeMilliseconds;
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
export const { setTimeOfImpact, setCurrentTime, setEndTime, incrementCurrentTime, decrementCurrentTime } = timeSlice.actions;

// these are the 'selectors' that are used to peek what the state.time contains
export const selectCurrentTimeMilliseconds  = (state: State) => state.time.currentTimeMilliseconds;
export const selectEndTimeMilliseconds      = (state: State) => state.time.endTimeMilliseconds;
export const selectTimeOfImpactMilliseconds = (state: State) => state.time.timeOfImpactMilliseconds;

// this is for configureStore()
export const timeReducer = timeSlice.reducer;