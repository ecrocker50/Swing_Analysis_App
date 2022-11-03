
import { Alert, Button, TextInput } from 'react-native';
import SelectList from 'react-native-dropdown-select-list'
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps, UserSessionsData } from '../types';
import { SELECTOR_MODE, REDUCER_SET_MODE_IN_STORE } from '../store/modeSelectSlice';
import { Mode } from '../types';
import { styles } from '../styles';
import { Dispatch, useState } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { doesSessionExist } from '../helpers/userDataMethods/userDataRead';
import { REDUCER_CREATE_NEW_SESSION_IN_STORE, SELECTOR_USER_SESSIONS, REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE } from '../store/swingDataSlice';
import { setDocumentInDB } from '../firebase/write';
import Navigation from '../navigation';
import { useNavigation } from '@react-navigation/native';

const ModeOptions: Array<Mode> = ["Forehand", "Backhand", "Serve"];


export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
    const dispatch = useDispatch();
    const mode = useSelector(SELECTOR_MODE);
    const userSessions = useSelector(SELECTOR_USER_SESSIONS);
    const [selectedModeLocal, setSelectedModeLocal]         = useState<Mode>(ModeOptions[0]);
    const [isSessionActive, setIsSessionActive]             = useState<Boolean>(false);
    const [numOfSwings, setNumOfSwings]                     = useState<number>(0);
    const [inputtedNameOfSession, setInputtedNameOfSession] = useState<string>("");
    const navigationHook = useNavigation();


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
                <Text style={styles.normalText}>Number of swings recorded: {numOfSwings}</Text>
                <View style={styles.space_small} />

                <View style={{flexDirection: 'row'}}>
                    <Button title="Save Session" color='green' 
                        onPress={() => {
                            setIsSessionActive(false);
                            setDocumentInDB(userSessions);
                        }} />

                    <Button title="Discard Session" color='red'
                        onPress={() => {
                            setIsSessionActive(false);
                            dispatch(REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE(inputtedNameOfSession));
                        }} />
                </View>
            </View>
        );
    }
    else {
        return (
            <View style={styles.topContainer}>
                <Text style={{...styles.title}}>Select your mode</Text>
                <View style={styles.lineUnderTitle} />

                <View style={styles.space_small} />

                {sessionModeSelectSection(dispatch, mode, selectedModeLocal, setSelectedModeLocal)}

                <View style={styles.space_medium} />

                <Text style={{...styles.title}}>Name this session</Text>
                <View style={styles.lineUnderTitle} />
                
                <TextInput 
                    placeholder='session name' 
                    textAlign='left' 
                    onChangeText={(inputtedText) => setInputtedNameOfSession(inputtedText)}
                    style={styles.textInputSessionName}>
                </TextInput>

                <View style={styles.space_medium} />
                { startSessionButton(dispatch, navigationHook, userSessions, inputtedNameOfSession, selectedModeLocal, setIsSessionActive) }
                
            </View> 

        );
    }
}

const timeOut = (ms: number) => new Promise(
    resolve => setTimeout(resolve, ms)
)

const startSessionButton = (dispatch: Dispatch<AnyAction>, navigation: any, userSessions: UserSessionsData, inputtedNameOfSession: string, selectedModeLocal: Mode, setIsSessionActive: Dispatch<React.SetStateAction<Boolean>>) => (
    <Button title="Start Session" onPress={async () => {
        if (inputtedNameOfSession === "") {
            Alert.alert("Please enter a session name");
        }
        else if (doesSessionExist(userSessions, inputtedNameOfSession)){
            Alert.alert("This session name has been used before, please enter a new name");
        }
        else
        {
            // There are no errors, proceed to start the session
            navigation.navigate('NotFound')
            await timeOut(1000)
            dispatch(REDUCER_CREATE_NEW_SESSION_IN_STORE({sessionName: inputtedNameOfSession, sessionMode: selectedModeLocal}));
            
            setIsSessionActive(true);
        }
    }} />
);



const sessionModeSelectSection = (dispatch: Dispatch<AnyAction>, mode: Mode, selectedModeLocal: Mode, setSelectedModeLocal: React.Dispatch<React.SetStateAction<Mode>>): JSX.Element => (
    <View style={{alignItems: 'center'}}>
        { ModeDescriptions(mode) }
                
        <View style={styles.space_medium} />

        <SelectList
            placeholder={mode}
            data={ModeOptions}
            search={false}
            boxStyles={styles.dropdownUnopened}
            dropdownStyles={styles.dropdown}
            dropdownItemStyles={styles.dropdownItem}
            dropdownTextStyles={styles.dropdownText}
            inputStyles={styles.dropdownSelectedText}
            setSelected={setSelectedModeLocal}
            onSelect={() => dispatch(REDUCER_SET_MODE_IN_STORE(selectedModeLocal))}
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
    const textStyle = styles.normalText;

    if (mode == ModeOptions[0]) {
        textComponent = 
            <Text style={textStyle}>
                This is the Forehand mode. Please perform consecutive forehand hits to compare your swing stats against others and your previous sessions!
                Please confirm the device LED is glowing PURPLE.
            </Text>;
    }
    else if (mode == ModeOptions[1]) {
        textComponent = 
            <Text style={textStyle}>
                This is the Backhand mode. Please perform consecutive backhand hits to compare your swing stats against others and your previous sessions!
                Please confirm the device LED is glowing GREEN.
            </Text>;
    }
    else if (mode == ModeOptions[2]) {
        textComponent = 
            <Text style={textStyle}>
                This is the Serve mode. Please perform consecutive overhand serve hits to compare your swing stats against others and your previous sessions!
                Please confirm the device LED is glowing RED.
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