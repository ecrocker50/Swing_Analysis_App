import { Button } from 'react-native';
import React, { Dispatch, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import SelectList from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { populateUserDataStoreFromDB } from '../firebase/read';
import { RootTabScreenProps, UserSessionsData } from '../types';
import {
    getAllSessionNames,
    getSwingsInsideSession
} from '../helpers/userDataMethods/userDataRead';
import {
    SELECTOR_USER_SESSIONS,
    REDUCER_SET_SELECTED_SESSION_IN_STORE,
    REDUCER_SET_SELECTED_SWING_IN_STORE
} from '../store/swingDataSlice';







export default function SessionSetupScreen({ navigation }: RootTabScreenProps<'SessionSetup'>) {
    const dispatch = useDispatch();
    const [chosenSession, setChosenSession] = useState<string>("");
    const [chosenSwing,   setChosenSwing]   = useState<number>(-1);

    const userSessionsData = useSelector(SELECTOR_USER_SESSIONS);

    const navigationHook = useNavigation();

    /*
        This is a super useful hook, called useEffect. 
        By default, it runs on component mount and every update to the component.
        However, here I've passed an empty array to its dependency list (2nd param), meaning that it will only run on component mount.
        If we were to put a variable in the dependency list, then whenever that variable updates, the useEffect function will run again
        What it is doing here is running populateUserDataStoreFromDB() only on component mount. 
        This way it doesn't fetch DB data more than once and overwrite the data we're getting from the ESP
    */
    useEffect(() => {
        populateUserDataStoreFromDB(dispatch);
    }, []);


    return (
        <View style={styles.topContainer}>
        <Text style={styles.title}>Saved Sessions</Text>
        <View style={styles.lineUnderTitle} />

        <View style={styles.space_extra_large} />

        {chooseASessionSection(dispatch, userSessionsData, chosenSession, setChosenSession)}
        <View style={styles.space_medium} />
        
        {visualizeButton(navigationHook, chosenSession)}

        </View>
    );
}






const chooseASessionSection = (dispatch: Dispatch<AnyAction>, userSessionsData: UserSessionsData, chosenSession: string, setChosenSession: React.Dispatch<React.SetStateAction<string>>): JSX.Element => {
    return (
        <View>
            <Text style={styles.title}>
                Choose a session
            </Text>
            <SelectList
                placeholder={"select a session"}
                data={getAllSessionNames(userSessionsData)}
                search={false}
                boxStyles={styles.dropdownUnopened}
                dropdownStyles={styles.dropdown}
                dropdownItemStyles={styles.dropdownItem}
                dropdownTextStyles={styles.dropdownText}
                inputStyles={styles.dropdownSelectedText}
                setSelected={setChosenSession}
                onSelect={() => dispatch(REDUCER_SET_SELECTED_SESSION_IN_STORE(chosenSession))}
            />
        </View>
    );
};


const chooseASwingSection = (dispatch: Dispatch<AnyAction>, userSessionsData: UserSessionsData, chosenSession: string, chosenSwing: number, setChosenSwing: React.Dispatch<React.SetStateAction<number>>): JSX.Element => {
    const swings = getSwingsInsideSession(userSessionsData, chosenSession);
    const swingIndexArray = Array.apply(null, Array(swings.length)).map((value, index) => index);

    const placeholderDisplay = chosenSwing !== -1 ? chosenSwing.toString() : "select";

    if (chosenSession) {
        return (
            <View>
                <Text style={styles.title}>
                    Select a swing
                </Text>
                <SelectList
                    placeholder={placeholderDisplay}
                    data={swingIndexArray}
                    search={false}
                    boxStyles={styles.dropdownUnopened}
                    dropdownStyles={styles.dropdown}
                    dropdownItemStyles={styles.dropdownItem}
                    dropdownTextStyles={styles.dropdownText}
                    inputStyles={styles.dropdownSelectedText}
                    setSelected={setChosenSwing}
                    onSelect={() => dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing))}
                />
            </View>
        );
    }
    else {
        return <View></View>;
    }
};





const visualizeButton = (navigation: any, chosenSession: string): JSX.Element => {
    return(
        <View>
            <Button title="Analyze Session" onPress={() => navigation.navigate('SwingVisualize')}></Button>
        </View>
    )
};
