import { configureStore } from '@reduxjs/toolkit';
import { modeSelectReducer } from './modeSelectSlice';

export const store = configureStore({
    reducer: {
        modeSelect: modeSelectReducer,
    },
});
