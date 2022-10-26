
import { Button } from 'react-native';
import React, { Dispatch, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import SelectList from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps, UserSessionsData, SingleSession } from '../types';
import { styles } from '../styles';
import {
    crappyDataMock,
    getAllSessionNames,
    getSwingsInsideSession
} from '../helpers/userDataHelpers';
import {
    setSelectedSession,
    setSelectedSwing
} from '../store/swingDataSlice';
import { firestore } from '../firebase';
import * as database from 'firebase/firestore';


async function getDatabaseSnapshot(firestore: database.Firestore): Promise<UserSessionsData> {
    
    let sessions: UserSessionsData = [];

    // Get the Firestore collection reference
    const collectionRef = database.collection(firestore, "user1");

    await database.getDocs(collectionRef).then(docSnapshot => {
        // Append each document (a single session) to the sessions variable
        docSnapshot.docs.map((document) => sessions.push(document.data() as SingleSession));
    });

    return sessions
}



export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
    const dispatch = useDispatch();
    const [chosenSession, setChosenSession] = useState<string>("");
    const [chosenSwing,   setChosenSwing]   = useState<number>(-1);

    const navigationHook = useNavigation();
    
    return (
        <View style={styles.topContainer}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.lineUnderTitle} />

        <View style={styles.space_extra_large} />
        <Button title={"try"} onPress={async () => console.log(await getDatabaseSnapshot(firestore))}></Button>

        {chooseASessionSection(dispatch, chosenSession, setChosenSession)}
        <View style={styles.space_medium} />
        {chooseASwingSection(dispatch, chosenSession, chosenSwing, setChosenSwing)}
        <View style={styles.space_extra_large} />
        {viewSwingButton(chosenSwing, navigationHook)}

        </View>
    );
}






const chooseASessionSection = (dispatch: Dispatch<AnyAction>, chosenSession: string, setChosenSession: React.Dispatch<React.SetStateAction<string>>): JSX.Element => {
    return (
        <View>
            <Text style={styles.title}>
                Choose a session
            </Text>
            <SelectList
                placeholder={"select a session"}
                data={getAllSessionNames(crappyDataMock)}
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


const chooseASwingSection = (dispatch: Dispatch<AnyAction>, chosenSession: string, chosenSwing: number, setChosenSwing: React.Dispatch<React.SetStateAction<number>>): JSX.Element => {
    const swings = getSwingsInsideSession(crappyDataMock, chosenSession);
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







