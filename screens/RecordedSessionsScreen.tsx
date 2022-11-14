import { Button, Modal, TextInput } from 'react-native';
import React, { Dispatch, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
import SelectList from 'react-native-dropdown-select-list';
import DropDownPicker from 'react-native-dropdown-picker';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { Mode, RootTabScreenProps, UserSessionsData } from '../types';
import {
    getAllSessionNames,
    getModeOfSession,
    getSwingsInsideSession
} from '../helpers/userDataMethods/userDataRead';
import {
    SELECTOR_USER_SESSIONS,
    REDUCER_SET_SELECTED_SESSION_IN_STORE,
    REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE,
    REDUCER_RENAME_SESSION_IN_STORE
} from '../store/swingDataSlice';



const countries = ["Egypt", "Canada", "Australia", "Ireland"]



export default function RecordedSessionsScreen({ navigation }: RootTabScreenProps<'RecordedSessions'>) {
    const dispatch = useDispatch();
    const [chosenSession, setChosenSession] = useState<string>("");
    const [editNameModalVisible, setEditNameModalVisible] = useState(false);
    
    const userSessionsData = useSelector(SELECTOR_USER_SESSIONS);
    const mode = getModeOfSession(userSessionsData, chosenSession);
    const numberOfSwings = getSwingsInsideSession(userSessionsData, chosenSession).length;

    const [isDropDownOpen, setIsDropDownOpenOpen] = useState(false);
    const [dropDownSelectedValue, setDropDownSelectedValue] = useState(null);
    const itemMap = getAllSessionNames(userSessionsData).map((sessionName) => {
        return {label: sessionName, value: sessionName}
    });

    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>Access Past Sessions</Text>
            <View style={styles.lineUnderTitle} />

            
            <View style={styles.space_medium} />

            {chooseASessionSection(dispatch, userSessionsData, chosenSession, setChosenSession)}

            
            <DropDownPicker
                open={isDropDownOpen}
                value={dropDownSelectedValue}
                items={itemMap}
                setOpen={setIsDropDownOpenOpen}
                setValue={setDropDownSelectedValue}
                placeholderStyle={styles.normalText}
                customItemLabelStyle={styles.normalText}
                selectedItemLabelStyle={styles.normalText}
                searchable={true}
                searchPlaceholder={"Search a Session"}
                searchTextInputStyle={styles.normalText}
                closeAfterSelecting={true}
                closeOnBackPressed={true}
                style={{width: '60%', alignSelf: 'center'}}
                dropDownContainerStyle={{width: '60%', alignSelf: 'center'}}
                listItemLabelStyle={styles.normalText}
                />

            <View style={styles.space_extra_large} />

            {sessionOverviewSection(mode, numberOfSwings)}
                    
            <View style={styles.space_medium} />

            {editSessionNameModalSection(dispatch, editNameModalVisible, setEditNameModalVisible, chosenSession)}

            <View style={styles.space_large} />

            { 
                chosenSession ?
                    <View style={{flexDirection: 'row'}}>
                        <Button 
                            title="Analyze Session" 
                            onPress={() => navigation.navigate('SwingVisualize')} 
                        />
                        
                        <Button 
                            color='red' 
                            title="Delete Session" 
                            onPress={() => {
                                dispatch(REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE(chosenSession));
                                setChosenSession("");
                            }}
                        />
                    </View>
                :
                    null
            }
        </View>
    );
}


const sessionOverviewSection = (mode: Mode, numberOfSwings: number): JSX.Element => {
    if (mode !== "Unknown") {
        return (
            <View style={{alignItems: 'center'}}>
                <Text style={styles.title}>Session Overview</Text>
                <View style={styles.space_small} />
                <Text style={styles.normalText}>Mode: {mode}</Text>
                <Text style={styles.normalText}>Number of swings: {numberOfSwings}</Text>
            </View>
        );
    }
    return (
        <View>
        </View>
    )
};



const editSessionNameModalSection = (dispatch: Dispatch<AnyAction>, editNameModalVisible: boolean, setEditNameModalVisible: React.Dispatch<React.SetStateAction<boolean>>, previousSessionName: string): JSX.Element => {
    let inputtedText = '';
    
    return (
        <View>
            <Button title='Edit Session Name' onPress={() => setEditNameModalVisible(true)}></Button>
            <Modal
                visible={editNameModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setEditNameModalVisible(false)}
                style={{height: 60, backgroundColor: 'rgba(52, 52, 52, 0.7)'}}
            >
                <View style={styles.modalView}>
                    <Text style={{...styles.normalText, marginBottom: 5}}>Enter new session name</Text>

                    <TextInput
                        placeholder={previousSessionName} 
                        textAlign='left' 
                        onChangeText={(input: string) => inputtedText = input}
                        style={styles.textInputSessionName}>
                    </TextInput>
                    <View style={{flexDirection: 'row', alignSelf: 'flex-end', marginRight: 20, marginTop: 20, }}>
                        <Button title='Save' color='green' onPress={() => {
                            setEditNameModalVisible(false);
                            dispatch(REDUCER_RENAME_SESSION_IN_STORE({oldSessionName: previousSessionName, newSessionName: inputtedText}));
                        }} />
                        <Button title='Cancel' onPress={() => setEditNameModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}



const chooseASessionSection = (dispatch: Dispatch<AnyAction>, userSessionsData: UserSessionsData, chosenSession: string, setChosenSession: React.Dispatch<React.SetStateAction<string>>): JSX.Element => {
    return (
        <View style={{alignItems: 'center'}}>
            <Text style={styles.title}>
                Choose a session
            </Text>


            <SelectList
                placeholder={"select a session"}
                data={getAllSessionNames(userSessionsData)}
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



