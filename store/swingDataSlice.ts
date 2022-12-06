import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SingleDataPoint, SingleSwing, RootState, Mode, UserSessionsData, Quaternion, Handedness } from '../types';
import { userDataMock } from '../helpers/userDataMethods/userDataMock';
import { 
    pushSwing,
    pushDataPoint,
    createNewEmptySession,
    removeSessionFromUserData,
    addTimeOfContactToSwing,
    renameSessionFromUserData,
    removeSwingFromSession,
    setCalibratedQuaternion,
    setSpeedAtContact
} from '../helpers/userDataMethods/userDataWrite';


type PushPointType = {
    sessionName: string,
    swingIndex: number,
    dataPoint: SingleDataPoint,
};

type PushSwingType = {
    sessionName: string,
    swingToPush: SingleSwing
};

type AddTimeOfContactType = {
    sessionName: string,
    swingIndex: number,
    timeOfContact: number
};

type AddContactSpeedType = {
    sessionName: string,
    swingIndex:  number,
    contactSpeed: number
};

type RenameSessionType = {
    oldSessionName: string,
    newSessionName: string
}

type CreateNewSessionType = {
    sessionName: string,
    sessionMode: Mode,
    calibratedQuaternion: Quaternion,
    handedness: Handedness
};

type RemoveSwingType = {
    sessionName: string,
    swingIndex: number
};



// default state that mode initializes to on app bootup
const initialState = {
    userSessions: userDataMock,   
    selectedSession: '',
    selectedSwing: -1
};


// creates a slice for the swings. This contains all the actions and reducers used for hooking into the store
export const swingDataSlice = createSlice({
    name: 'swingData',
    initialState,
    reducers: {
        /** Pushes a new point to a specified swing **/ 
        REDUCER_PUSH_POINT_TO_SWING_IN_STORE: (state, action: PayloadAction<PushPointType>) => {
            pushDataPoint(state.userSessions, action.payload.sessionName, action.payload.swingIndex, action.payload.dataPoint);
        },
        /** Pushes a new swing to a specified session **/ 
        REDUCER_PUSH_SWING_TO_SESSION_IN_STORE: (state, action: PayloadAction<PushSwingType>) => {
            pushSwing(state.userSessions, action.payload.sessionName, action.payload.swingToPush);
        },
        REDUCER_ADD_TIME_OF_CONTACT_TO_SWING_IN_STORE: (state, action: PayloadAction<AddTimeOfContactType>) => {
            addTimeOfContactToSwing(state.userSessions, action.payload.sessionName, action.payload.swingIndex, action.payload.timeOfContact);
        },
        /** Creates a new, empty session that can have data pushed into it **/
        REDUCER_CREATE_NEW_SESSION_IN_STORE: (state, action: PayloadAction<CreateNewSessionType>) => {
            createNewEmptySession(state.userSessions, action.payload.sessionName, action.payload.sessionMode, action.payload.calibratedQuaternion, action.payload.handedness);
        },
        /** Sets the session that was selected to analyze/view **/
        REDUCER_SET_SELECTED_SESSION_IN_STORE: (state, action: PayloadAction<string>) => {
            state.selectedSession = action.payload;
        },
        /** Sets the swing that was selected to analyze/view **/
        REDUCER_SET_SELECTED_SWING_IN_STORE: (state, action: PayloadAction<number>) => {
            state.selectedSwing = action.payload;
        },
        /** Sets the full user data. This will likely only be called on app boot when data is being populated from DB */
        REDUCER_SET_ALL_USER_DATA_IN_STORE: (state, action: PayloadAction<UserSessionsData>) => {
            state.userSessions = action.payload;
        },
        /** Removes a session from the store */
        REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE: (state, action: PayloadAction<string>) => {
            removeSessionFromUserData(state.userSessions, action.payload);
        },
        REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE: (state, action: PayloadAction<RemoveSwingType>) => {
            removeSwingFromSession(state.userSessions, action.payload.sessionName, action.payload.swingIndex);
        },
        /** Renames a session in the store */
        REDUCER_RENAME_SESSION_IN_STORE: (state, action: PayloadAction<RenameSessionType>) => {
            renameSessionFromUserData(state.userSessions, action.payload.oldSessionName, action.payload.newSessionName);
        },
        REDUCER_SET_CALIBRATED_QUATERNION_IN_SESSION: (state, action: PayloadAction<Quaternion>) => {
            setCalibratedQuaternion(state.userSessions, state.selectedSession, action.payload);
        },
        REDUCER_ADD_CONTACT_SPEED_TO_SWING_IN_STORE: (state, action: PayloadAction<AddContactSpeedType>) => {
            setSpeedAtContact(state.userSessions, action.payload.sessionName, action.payload.swingIndex, action.payload.contactSpeed);
        }
    }
});


// these are the actions we can dispatch
export const { 
    REDUCER_PUSH_POINT_TO_SWING_IN_STORE, 
    REDUCER_PUSH_SWING_TO_SESSION_IN_STORE, 
    REDUCER_CREATE_NEW_SESSION_IN_STORE, 
    REDUCER_SET_SELECTED_SESSION_IN_STORE,
    REDUCER_SET_SELECTED_SWING_IN_STORE, 
    REDUCER_SET_ALL_USER_DATA_IN_STORE, 
    REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE,
    REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE, 
    REDUCER_ADD_TIME_OF_CONTACT_TO_SWING_IN_STORE,
    REDUCER_RENAME_SESSION_IN_STORE,
    REDUCER_ADD_CONTACT_SPEED_TO_SWING_IN_STORE
} = swingDataSlice.actions;

// these are the 'selectors' that are used to peek what the state.swingData contains
export const SELECTOR_USER_SESSIONS    = (state: RootState) => state.swingData.userSessions;
export const SELECTOR_SELECTED_SESSION = (state: RootState) => state.swingData.selectedSession;
export const SELECTOR_SELECTED_SWING   = (state: RootState) => state.swingData.selectedSwing;

// this is for configureStore()
export const swingDataReducer = swingDataSlice.reducer;