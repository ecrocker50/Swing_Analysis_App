import { configureStore } from '@reduxjs/toolkit';
import { modeSelectReducer } from './modeSelectSlice';
import { timeReducer } from './timeSlice';
import { swingDataReducer } from './swingDataSlice';
import { bleReducer } from './bleSlice';

export const store = configureStore({
    reducer: {
        modeSelect: modeSelectReducer,
        time: timeReducer,
        swingData: swingDataReducer,
        ble: bleReducer
    },
});
