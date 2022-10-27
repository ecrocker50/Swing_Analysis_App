
import { Button } from 'react-native';
import React, { Dispatch, useEffect, useState } from 'react';
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
} from '../helpers/userDataHelpers';
import {
    selectUserSessions,
    setSelectedSession,
    setSelectedSwing
} from '../store/swingDataSlice';



export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
    const dispatch = useDispatch();
    const [chosenSession, setChosenSession] = useState<string>("");
    const [chosenSwing,   setChosenSwing]   = useState<number>(-1);

    const userSessionsData = useSelector(selectUserSessions);

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
        <Text style={styles.title}>Home</Text>
        <View style={styles.lineUnderTitle} />

        <View style={styles.space_extra_large} />
        

        {chooseASessionSection(dispatch, userSessionsData, chosenSession, setChosenSession)}
        <View style={styles.space_medium} />
        {chooseASwingSection(dispatch, userSessionsData, chosenSession, chosenSwing, setChosenSwing)}
        <View style={styles.space_extra_large} />
        {viewSwingButton(chosenSwing, navigationHook)}

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
                onSelect={() => dispatch(setSelectedSession(chosenSession))}
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
                    onSelect={() => dispatch(setSelectedSwing(chosenSwing))}
                />
            </View>
        );
    }
    else {
        return <View></View>;
    }
};




const viewSwingButton = (selectedSwing: number, navigation: any): JSX.Element => {
    if (selectedSwing !== -1) {
        return (
            <View>
                <Button title="Analyze Swing" onPress={() => navigation.navigate('Modal')}></Button>
            </View>
        );
    }
    else {
        return (
            <View></View>
        );
    }
};




