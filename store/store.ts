import { configureStore } from '@reduxjs/toolkit';
import { modeSelectReducer } from './modeSelectSlice';
import { timeReducer } from './timeSlice';
import { swingDataReducer } from './swingDataSlice';

export const store = configureStore({
    reducer: {
        modeSelect: modeSelectReducer,
        time: timeReducer,
        swingData: swingDataReducer
    },
});
