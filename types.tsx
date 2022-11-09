/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    SwingVisualize: undefined;
    SessionInProgress: undefined;
    NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
    RootStackParamList,
    Screen
>;

export type RootTabParamList = {
    Home: undefined;
    RecordedSessions: undefined;
    Settings: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
>;


/**
 * Below here is where our defined types will go
 */

// The modes of swings that are supported
export type Mode = "Serve" | "Forehand" | "Backhand" | "Unknown";

export type Quaternion = {
    real: number;
    i:    number;
    j:    number;
    k:    number;
};

export type Position = {
    x: number;
    y: number;
    z: number;
};

export type SingleDataPoint = {
    time: number;
    quaternion: Quaternion;
    position: Position;
};

export type SingleSwing = {
    points: Array<SingleDataPoint>;
    timeOfContact: number;
};

export type SingleSession = {
    sessionName: string;
    mode: Mode;
    swings: Array<SingleSwing>
};

export type UserSessionsData = Array<SingleSession>;
    


/**
 * This is the global 'state' type. Everything in here will be able to be accessed globally by hooking into the store
 */
export type RootState = {
    ble: {
        deviceId:   string,
        deviceName: string
    };
    modeSelect: {
        mode: Mode;
    };
    time: {
        currentTimeSeconds: number;
    };
    swingData: {
        userSessions: UserSessionsData;
        selectedSession: string;
        selectedSwing: number;
    };
    batteryPercent: {
        batteryTimerRef: NodeJS.Timer;
        isBatteryTimerRunning: boolean;
        batteryPercent: number;
    };
};
