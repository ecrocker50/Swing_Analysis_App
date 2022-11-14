import { Button, Modal, TextInput } from 'react-native';
import React, { Dispatch, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';
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







export default function RecordedSessionsScreen({ navigation }: RootTabScreenProps<'RecordedSessions'>) {
    const dispatch = useDispatch();
    const [chosenSession, setChosenSession] = useState<string>("");
    const [editNameModalVisible, setEditNameModalVisible] = useState(false);
    
    const userSessionsData = useSelector(SELECTOR_USER_SESSIONS);
    const mode = getModeOfSession(userSessionsData, chosenSession);
    const numberOfSwings = getSwingsInsideSession(userSessionsData, chosenSession).length;

    const [isDropDownOpen, setIsDropDownOpenOpen] = useState(false);
    const itemMap = getAllSessionNames(userSessionsData).map((sessionName) => {
        return {label: sessionName, value: sessionName}
    });
    
    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>Access Past Sessions</Text>
            <View style={styles.lineUnderTitle} />

            <View style={styles.space_medium} />

            <Text style={styles.title}>
                Choose a session
            </Text>
            <DropDownPicker
                open={isDropDownOpen}
                value={chosenSession}
                items={itemMap}
                setOpen={setIsDropDownOpenOpen}
                setValue={setChosenSession}
                searchable={true}
                closeAfterSelecting={true}
                closeOnBackPressed={true}
                TickIconComponent={({style}) => <Entypo name='magnifying-glass' size={20} style={style} />}
                style={{width: '60%', alignSelf: 'center'}}
                textStyle={styles.normalText}
                placeholderStyle={styles.normalText}
                searchPlaceholder={"Search a Session"}
                searchTextInputStyle={styles.normalText}
                dropDownContainerStyle={{width: '60%', alignSelf: 'center'}}
                listItemLabelStyle={styles.normalText}
                ListEmptyComponent={() => <View style={{height: 35}}><Text style={{...styles.normalText, marginTop: 4, fontStyle: 'italic'}}>No Data</Text></View>}
                />

            <View style={styles.space_extra_large} />

            {sessionOverviewSection(mode, numberOfSwings)}
                    
            <View style={styles.space_medium} />

            {editSessionNameModalSection(dispatch, editNameModalVisible, setEditNameModalVisible, chosenSession, setChosenSession)}

            <View style={styles.space_large} />

            { 
                chosenSession ?
                    <View style={{flexDirection: 'row'}}>
                        <Button 
                            title="Analyze Session" 
                            onPress={() => {
                                dispatch(REDUCER_SET_SELECTED_SESSION_IN_STORE(chosenSession))
                                navigation.navigate('SwingVisualize')
                            }} 
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
            <View style={{alignItems: 'center', zIndex: -5}}>
                <Text style={{...styles.title}}>Session Overview</Text>
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



const editSessionNameModalSection = (dispatch: Dispatch<AnyAction>, editNameModalVisible: boolean, setEditNameModalVisible: React.Dispatch<React.SetStateAction<boolean>>, previousSessionName: string, setChosenSession: Dispatch<React.SetStateAction<string>>): JSX.Element => {
    let inputtedText = '';
    
    return (
        <View style={{zIndex: -5}}>
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
                            setChosenSession(inputtedText);
                        }} />
                        <Button title='Cancel' onPress={() => setEditNameModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}



const chooseASessionSection = (dispatch: Dispatch<AnyAction>, userSessionsData: UserSessionsData, chosenSession: string, setChosenSession: React.Dispatch<React.SetStateAction<string>>, isDropDownOpen: any, setIsDropDownOpenOpen: any): JSX.Element => {
    const itemMap = getAllSessionNames(userSessionsData).map((sessionName) => {
        return {label: sessionName, value: sessionName}
    });
    
    return (
        <View style={{alignItems: 'center'}}>
            <Text style={styles.title}>
                Choose a session
            </Text>
            <DropDownPicker
                open={isDropDownOpen}
                value={chosenSession}
                items={itemMap}
                setOpen={setIsDropDownOpenOpen}
                setValue={() => {
                    setChosenSession; 
                    dispatch(REDUCER_SET_SELECTED_SESSION_IN_STORE(chosenSession))
                }}
                searchable={true}
                closeAfterSelecting={true}
                closeOnBackPressed={true}
                TickIconComponent={({style}) => <Entypo name='magnifying-glass' size={20} style={style} />}
                style={{width: '60%', alignSelf: 'center'}}
                textStyle={styles.normalText}
                placeholderStyle={styles.normalText}
                searchPlaceholder={"Search a Session"}
                searchTextInputStyle={styles.normalText}
                dropDownContainerStyle={{width: '60%', alignSelf: 'center'}}
                listItemLabelStyle={styles.normalText}
                listMode="SCROLLVIEW"
                    scrollViewProps={{
                        scrollEnabled: true,
                        nestedScrollEnabled: true,
                        scrollToOverflowEnabled: true
                }}
                />
        </View>
    );
};



