
import { Alert, Button, KeyboardAvoidingView, TextInput, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps, UserSessionsData } from '../types';
import { REDUCER_SET_MODE_IN_STORE } from '../store/modeSelectSlice';
import { Mode } from '../types';
import { styles } from '../styles';
import React, { Dispatch, useEffect, useState } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { doesSessionExist, getNumberOfSwingsInsideSession } from '../helpers/userDataMethods/userDataRead';
import { REDUCER_CREATE_NEW_SESSION_IN_STORE, SELECTOR_USER_SESSIONS, REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE } from '../store/swingDataSlice';
import { setDocumentInDB } from '../firebase/write';
import { useNavigation } from '@react-navigation/native';
import { scanAndStoreDeviceConnectionInfo, writeMode } from '../bluetooth/methods';
import { SELECTOR_DEVICE_ID } from '../store/bleSlice';
import { populateUserDataStoreFromDB } from '../firebase/read';
import { SELECTOR_IS_BATTERY_TIMER_RUNNING } from '../store/batteryPercentageSlice';

const ModeOptions: Array<Mode> = ["Forehand", "Backhand", "Serve"];

const ModeOptionsMap: Array<Object> = [{label: "Forehand", value: "Forehand"}, {label: "Backhand", value: "Backhand"}, {label: "Serve", value: "Serve"}]



export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
    const dispatch = useDispatch();
    const userSessions = useSelector(SELECTOR_USER_SESSIONS);
    const isBatteryTimerRunning = useSelector(SELECTOR_IS_BATTERY_TIMER_RUNNING);
    const deviceId = useSelector(SELECTOR_DEVICE_ID);
    const [selectedModeLocal, setSelectedModeLocal]         = useState<Mode>(ModeOptions[0]);
    const [isSessionActive, setIsSessionActive]             = useState<Boolean>(false);
    const [inputtedNameOfSession, setInputtedNameOfSession] = useState<string>("");
    const navigationHook = useNavigation();
    const [isDropDownOpen, setIsDropDownOpenOpen] = useState(false);

    //useEffect for connecting to ble device as soon as app is loaded
    useEffect(() => {
        scanAndStoreDeviceConnectionInfo(dispatch, isBatteryTimerRunning);
        populateUserDataStoreFromDB(dispatch);
    }, []);


    if (isSessionActive) {
        return (
            <View style={styles.topContainer}>
                <Text style={{...styles.title}}>Session Ended</Text>
                <View style={styles.lineUnderTitle} />

                <View style={styles.space_extra_small} />

                <Text style={styles.normalText}>Session name: {inputtedNameOfSession}</Text>
                <View style={styles.space_small} />
                <Text style={styles.normalText}>Session mode: {selectedModeLocal}</Text>
                <View style={styles.space_large} />
                <Text style={styles.normalText}>Number of swings recorded: {getNumberOfSwingsInsideSession(userSessions, inputtedNameOfSession)}</Text>
                <View style={styles.space_small} />

                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity 
                        style={styles.buttonRegular}
                        onPress={() => {
                            setIsSessionActive(false);
                            setDocumentInDB(userSessions);
                        }} >
                            <Text style={styles.buttonText}>Save Session</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{...styles.buttonRed, marginLeft: 10}}
                        onPress={() => {
                            setIsSessionActive(false);
                            dispatch(REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE(inputtedNameOfSession));
                        }} >
                            <Text style={styles.buttonText}>Discard Session</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
    else {
        return (
            <View style={styles.topContainer}>
                <View style={{...styles.jumbotron_gray, width: '95%'}}>
                    <Text style={styles.title}>Session Name</Text>
                    <Text style={styles.normalText}>This is the name that you will search for later to find this session</Text>
                    <TextInput 
                        placeholder='session name' 
                        textAlign='left' 
                        onChangeText={(inputtedText) => setInputtedNameOfSession(inputtedText)}
                        style={styles.textInputSessionName}>
                    </TextInput>
                </View>
                
                <View style={styles.space_small} />

                <View style={{...styles.jumbotron_gray, width: '95%'}} >
                    <Text style={styles.title}>Mode Select</Text>

                    <View style={styles.space_small} />
                    
                    {sessionModeSelectSection(selectedModeLocal, setSelectedModeLocal, isDropDownOpen, setIsDropDownOpenOpen)}
                </View>
                <View style={styles.space_small} />

                { startSessionButton(dispatch, navigationHook, userSessions, inputtedNameOfSession, selectedModeLocal, deviceId, setIsSessionActive) }
            </View> 

        );
    }
}

const timeOut = (ms: number) => new Promise(
    resolve => setTimeout(resolve, ms)
)

const startSessionButton = (dispatch: Dispatch<AnyAction>, navigation: any, userSessions: UserSessionsData, inputtedNameOfSession: string, selectedModeLocal: Mode, deviceId: string, setIsSessionActive: Dispatch<React.SetStateAction<Boolean>>) => {
    let buttonStyle = styles.buttonRegular;

    if (selectedModeLocal === 'Forehand') {
        buttonStyle = styles.buttonMagenta;
    } 
    else if (selectedModeLocal === 'Backhand') {
        buttonStyle = styles.buttonCyan;
    }
    else if (selectedModeLocal === 'Serve') {
        buttonStyle = styles.buttonGreen;
    }


    return (
        <TouchableOpacity 
            activeOpacity={.6}
            style={{...buttonStyle, zIndex: -10}}
            onPress={async () => {
                if (inputtedNameOfSession === "") {
                    Alert.alert("Please enter a session name");
                }
                else if (doesSessionExist(userSessions, inputtedNameOfSession)){
                    Alert.alert("This session name has been used before, please enter a new name");
                }
                else
                {
                    // There are no errors, proceed to start the session
                    dispatch(REDUCER_SET_MODE_IN_STORE(selectedModeLocal));
                    dispatch(REDUCER_CREATE_NEW_SESSION_IN_STORE({sessionName: inputtedNameOfSession, sessionMode: selectedModeLocal}));
                    writeMode(deviceId, selectedModeLocal)
                    navigation.navigate('SessionInProgress')
                    await timeOut(1000)
                    
                    setIsSessionActive(true);
                }
            }}>
            <Text style={styles.buttonText}>Start Session</Text>
        </TouchableOpacity>
    );
};

const sessionModeSelectSection = (selectedModeLocal: Mode, setSelectedModeLocal: React.Dispatch<React.SetStateAction<Mode>>, isDropDownOpen: boolean, setIsDropDownOpenOpen: React.Dispatch<React.SetStateAction<boolean>>): JSX.Element => (
    <View style={{zIndex: 10, backgroundColor: 'transparent'}}>
        { ModeDescriptions(selectedModeLocal) }
                
        <View style={styles.space_small} />
        <DropDownPicker
            open={isDropDownOpen}
            value={selectedModeLocal}
            items={ModeOptionsMap}
            setOpen={setIsDropDownOpenOpen}
            setValue={setSelectedModeLocal}
            closeAfterSelecting={true}
            closeOnBackPressed={true}
            style={styles.dropdown}
            textStyle={styles.normalText}
            placeholderStyle={styles.normalText}
            dropDownContainerStyle={styles.dropdown}
            listItemLabelStyle={styles.normalText}
            />
        
    </View>
);



/** Generates a text element to display based on the selected mode. Contains descriptions and such
 * 
 * @param mode The mode that the app is in (forehand, backhand, etc)
 * @returns JSX.Element - the text element to display for the specific mode
 */
const ModeDescriptions = (mode: Mode): JSX.Element => {
    let textComponent;
    const textStyle = {...styles.normalText, marginBottom: 20};

    if (mode == ModeOptions[0]) {
        textComponent = 
            <Text style={textStyle}>
                Perform consecutive forehand hits to compare your swing against others and your previous sessions!
            </Text>;
    }
    else if (mode == ModeOptions[1]) {
        textComponent = 
            <Text style={textStyle}>
                Perform consecutive backhand hits to compare your swing against others and your previous sessions!
            </Text>;
    }
    else if (mode == ModeOptions[2]) {
        textComponent = 
            <Text style={textStyle}>
                Perform consecutive overhand serve hits to compare your swing stats against others and your previous sessions!
            </Text>;
    }
    else {
        textComponent = 
            <Text style={textStyle}>
                This mode is not recognized. Oh noes!
            </Text>;
    }

    return textComponent;
};