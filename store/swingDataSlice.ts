import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SingleDataPoint, SingleSwing, RootState } from '../types';

import { 
    crappyDataMock,
    pushSwing,
    pushDataPoint,
    createNewEmptySession
} from '../helpers/userDataHelpers';


type PushPointType = {
    sessionName: string,
    swingIndex: number,
    dataPoint: SingleDataPoint,
};

type PushSwingType = {
    sessionName: string,
    swingToPush: SingleSwing
};


// default state that mode initializes to on app bootup
const initialState = {
    userSessions: crappyDataMock,   
    selectedSession: "",
    selectedSwing: -1     
};


// creates a slice for the swings. This contains all the actions and reducers used for hooking into the store
export const swingDataSlice = createSlice({
    name: 'swingData',
    initialState,
    reducers: {
        /** Pushes a new point to a specified swing **/ 
        pushPointToSwing: (state, action: PayloadAction<PushPointType>) => {
            pushDataPoint(state.userSessions, action.payload.sessionName, action.payload.swingIndex, action.payload.dataPoint);
        },
        /** Pushes a new swing to a specified session **/ 
        pushSwingToSession: (state, action: PayloadAction<PushSwingType>) => {
            pushSwing(state.userSessions, action.payload.sessionName, action.payload.swingToPush);
        },
        /** Creates a new, empty session that can have data pushed into it **/
        createNewSession: (state, action: PayloadAction<string>) => {
            createNewEmptySession(state.userSessions, action.payload);
        },
        /** Sets the session that was selected to analyze/view **/
        setSelectedSession: (state, action: PayloadAction<string>) => {
            state.selectedSession = action.payload;
        },
        /** Sets the swing that was selected to analyze/view **/
        setSelectedSwing: (state, action: PayloadAction<number>) => {
            state.selectedSwing = action.payload;
        }
    }
});


// these are the actions we can dispatch
export const { pushPointToSwing, pushSwingToSession, createNewSession, setSelectedSession, setSelectedSwing } = swingDataSlice.actions;

// these are the 'selectors' that are used to peek what the state.swingData contains
export const selectUserSessions    = (state: RootState) => state.swingData.userSessions;
export const selectSelectedSession = (state: RootState) => state.swingData.selectedSession;
export const selectSelectedSwing   = (state: RootState) => state.swingData.selectedSwing;

// this is for configureStore()
export const swingDataReducer = swingDataSlice.reducer;