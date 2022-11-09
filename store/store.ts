import { configureStore } from '@reduxjs/toolkit';
import { modeSelectReducer } from './modeSelectSlice';
import { timeReducer } from './timeSlice';
import { swingDataReducer } from './swingDataSlice';
import { bleReducer } from './bleSlice';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { batteryPercentReducer } from './batteryPercentageSlice';

export const store = configureStore({
    reducer: {
        modeSelect: modeSelectReducer,
        time: timeReducer,
        swingData: swingDataReducer,
        ble: bleReducer,
        batteryPercent: batteryPercentReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
});
