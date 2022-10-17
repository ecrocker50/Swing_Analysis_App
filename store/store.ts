import { configureStore } from '@reduxjs/toolkit';
import { modeSelectReducer } from './modeSelectSlice';
import { timeReducer } from './timeSlice';

export const store = configureStore({
    reducer: {
        modeSelect: modeSelectReducer,
        time: timeReducer
    },
});
