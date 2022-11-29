import { Modal, TextInput, TouchableOpacity } from 'react-native';
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
import { getModeColor } from '../helpers/color';







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

            
            <View style={{...styles.jumbotron_gray, width: '90%'}}>
                <Text style={styles.title}>Access Past Session</Text>

                <View style={styles.space_medium} />

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
                    style={{...styles.dropdown, width: '90%'}}
                    textStyle={styles.normalText}
                    placeholderStyle={styles.normalText}
                    searchPlaceholder={"Search a Session"}

                    ArrowDownIconComponent={({style}) => <Entypo name='magnifying-glass' size={20} style={style} />}
                
                    listMode="MODAL"
                    searchTextInputStyle={styles.normalText}
                    dropDownContainerStyle={{...styles.dropdown, width: '90%'}}
                    listItemLabelStyle={styles.normalText}
                    ListEmptyComponent={() => <View style={{height: 35}}><Text style={{...styles.normalText, marginTop: 4, fontStyle: 'italic'}}>No Data</Text></View>}
                    />

                <View style={styles.space_extra_large} />

                {editSessionNameModalSection(dispatch, editNameModalVisible, setEditNameModalVisible, chosenSession, setChosenSession)}
            </View>

            <View style={styles.space_medium} />

            <View style={chosenSession !== "" ? {...styles.jumbotron_gray, width: '90%', zIndex: -5} : undefined}>
                {sessionOverviewSection(mode, numberOfSwings)}

                <View style={styles.space_large} />
                
                { 
                    chosenSession ?
                        <View style={{flexDirection: 'row', backgroundColor: "transparent", marginBottom: -20}}>
                            <TouchableOpacity 
                                style={styles.buttonRegular}
                                onPress={() => {
                                    dispatch(REDUCER_SET_SELECTED_SESSION_IN_STORE(chosenSession))
                                    navigation.navigate('SwingVisualize')
                                }} >
                                    <Text style={styles.buttonText}>Analyze Session</Text>
                            </TouchableOpacity>

                            
                            <TouchableOpacity 
                                style={{...styles.buttonRed, marginLeft: 5}}
                                onPress={() => {
                                    dispatch(REDUCER_REMOVE_SESSION_FROM_USER_DATA_IN_STORE(chosenSession));
                                    setChosenSession("");
                                }} >
                                    <Text style={styles.buttonText}>Delete Session</Text>
                            </TouchableOpacity>
                        </View>
                    :
                        null
                }
            </View>
        </View>
    );
}


const sessionOverviewSection = (mode: Mode, numberOfSwings: number): JSX.Element => {
    const color = getModeColor(mode);
    let marginLeft;

    if (mode === 'Forehand') {
        marginLeft = '14%';
    }
    else if (mode === 'Backhand') {
        marginLeft = '13%';
    }
    else if (mode === 'Serve') {
        marginLeft = '25%';
    }

    if (mode !== "Unknown") {
        return (
            <View style={{zIndex: -5, backgroundColor: "transparent"}}>
                <View style={{flexDirection: 'row', backgroundColor: 'transparent'}}>
                    <Text style={{...styles.title}}>Session Details</Text>
                    <Text style={{fontSize: 18, textAlign: 'right', flex: 1, marginLeft, borderColor: color, color, borderWidth: 2, borderRadius: 10, paddingRight: 7, paddingTop: 1}}>{mode}</Text>
                </View>
                <View style={styles.space_small} />
                <Text style={{...styles.normalText}}>{numberOfSwings} swings</Text>
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
        <View style={{zIndex: -5, backgroundColor: 'transparent', alignItems: 'center'}}>
            { previousSessionName ?
                <TouchableOpacity 
                    style={styles.buttonRegular}
                    onPress={() => setEditNameModalVisible(true)} >
                        <Text style={styles.buttonText}>Edit Session Name</Text>
                </TouchableOpacity>
            :
                null
            }

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
                        <TouchableOpacity 
                            style={styles.buttonRegular}
                            onPress={() => {
                                setEditNameModalVisible(false);
                                dispatch(REDUCER_RENAME_SESSION_IN_STORE({oldSessionName: previousSessionName, newSessionName: inputtedText}));
                                setChosenSession(inputtedText);
                            }} >
                                <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={{...styles.buttonRed, marginLeft: 5}}
                            onPress={() => setEditNameModalVisible(false)} >
                                <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
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


