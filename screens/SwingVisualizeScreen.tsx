import React, { Dispatch, useState } from 'react';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { AnyAction } from '@reduxjs/toolkit';
import { Text, View } from '../components/Themed';
import { buttonColor, styles } from '../styles';
import { doesSessionHaveSwings, getMaxTimeOfSwing, getNumberOfSwingsInsideSession, getPosition, getQuaternion, getSwingsInsideSession, getTimeOfContact, getTimesOfAllPointsInSwing } from '../helpers/userDataMethods/userDataRead';
import {
    REDUCER_SET_CURRENT_TIME_IN_STORE,
    SELECTOR_CURRENT_TIME_SECONDS, 
} from '../store/timeSlice';
import {
    REDUCER_SET_SELECTED_SWING_IN_STORE,
    REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE,
    SELECTOR_SELECTED_SESSION,
    SELECTOR_USER_SESSIONS,
} from '../store/swingDataSlice';
import { Entypo } from '@expo/vector-icons';
import { RacketOrientationDisplay } from '../components/RacketOrientation';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function SwingVisualizeScreen() {
    const dispatch = useDispatch();
    
    const currentTimeSeconds   = useSelector(SELECTOR_CURRENT_TIME_SECONDS);
    const selectedSession = useSelector(SELECTOR_SELECTED_SESSION);
    const userSessions    = useSelector(SELECTOR_USER_SESSIONS);
    const [chosenSwing,   setChosenSwing]   = useState<number>(0);

    const quaternion  = getQuaternion(userSessions, selectedSession, chosenSwing, currentTimeSeconds);
    const position    = getPosition(userSessions, selectedSession, chosenSwing, currentTimeSeconds);

    const [isDropDownOpen, setIsDropDownOpenOpen] = useState(false);
    const numOfSwings = getNumberOfSwingsInsideSession(userSessions, selectedSession);

  

    if(chosenSwing !== -1)
    {
        const swingIndexMap = Array.apply(null, Array(numOfSwings)).map((val, index) => {return {label: index.toString(), value: index}});
        const allSwingTimePoints = getTimesOfAllPointsInSwing(userSessions, selectedSession, chosenSwing);
        const maxSwingValue = getMaxTimeOfSwing(userSessions, selectedSession, chosenSwing);
        const swings = getSwingsInsideSession(userSessions, selectedSession).length;
        return (
            <View style={styles.topContainer}>
                <Text style={{...styles.title, textAlign: 'center', marginLeft: 0}}>
                    Selected swing
                </Text>

                <DropDownPicker
                    open={isDropDownOpen}
                    value={chosenSwing}
                    items={swingIndexMap}
                    setOpen={setIsDropDownOpenOpen}
                    setValue={setChosenSwing}
                    searchable={true}
                    closeAfterSelecting={true}
                    closeOnBackPressed={true}
                    TickIconComponent={({style}: any) => <Entypo name='magnifying-glass' size={20} style={style} />}
                    style={{width: '60%', alignSelf: 'center'}}
                    textStyle={styles.normalText}
                    placeholderStyle={styles.normalText}
                    searchPlaceholder={"Search a Swing"}
                    searchTextInputStyle={styles.normalText}
                    dropDownContainerStyle={{width: '60%', alignSelf: 'center'}}
                    listItemLabelStyle={styles.normalText}
                    ListEmptyComponent={() => <View style={{height: 35}}><Text style={{...styles.normalText, marginTop: 4, fontStyle: 'italic'}}>No Data</Text></View>}
                    />

                <View style={{flexDirection: 'row', alignSelf: 'center', paddingTop: 13, backgroundColor: 'transparent'}}>
                    <TouchableOpacity 
                        style={styles.buttonRed}
                        onPress={() => {
                            if(chosenSwing > 0)
                            {
                                setChosenSwing(chosenSwing-1)
                                dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing));
                            }
                        }} >
                            <Text style={styles.buttonText}>Prev</Text>
                    </TouchableOpacity>

                    <View style={styles.space_small} />
                    <TouchableOpacity 
                        style={{...styles.buttonGreen, marginLeft: 10}}
                        onPress={() => {
                            if(chosenSwing < getSwingsInsideSession(userSessions, selectedSession).length - 1)
                            {
                                setChosenSwing(chosenSwing+1);
                                dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing));
                            }
                        }} >
                            <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.space_small}></View>

                <View style={styles.fullSeparator}></View>

                <ScrollView>
                    
                    <View style={styles.space_extra_small}></View>
                    <View style={{borderWidth: 2, borderColor: buttonColor, borderRadius: 20, width: '80%', alignSelf: 'center'}}>
                        { RacketOrientationDisplay(currentTimeSeconds, quaternion) }
                    </View>


                    
                    <Text style={{...styles.normalText, padding: 50}}>
                        ETHAN PUT YOUR 3D PLOT HERE
                    </Text>




                    <View style={styles.space_large}></View>

                    <Text style={{...styles.boldText, textAlign: 'center'}}>
                        Time of Contact: {getTimeOfContact(userSessions, selectedSession, chosenSwing).toFixed(6)}s   {'\n'}
                        Current Time:   {currentTimeSeconds.toFixed(6)}s
                    </Text>

                    <Slider 
                        style={styles.slider} 
                        onValueChange={(value) => correctSliderValueAndSetStore(dispatch, value, allSwingTimePoints)}
                        maximumValue={maxSwingValue}
                        minimumValue={0}
                    />

                    <View style={styles.space_large} />

                    <View style={{width: '60%', alignItems: 'center', alignSelf: 'center'}}>
                        <TouchableOpacity 
                            style={styles.buttonRed}
                            onPress={() => {
                                dispatch(REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE({sessionName: selectedSession, swingIndex: chosenSwing}));
                                if(doesSessionHaveSwings(userSessions, selectedSession) === 1)
                                {
                                    setChosenSwing(-1);
                                }
                                else
                                {
                                    if(chosenSwing === 0)
                                    {
                                        setChosenSwing(chosenSwing);
                                    }
                                    else
                                    {
                                        setChosenSwing(chosenSwing-1);
                                    }
                                }
                            }} >
                                <Text style={styles.buttonText}>Delete Swing</Text>
                        </TouchableOpacity>
                    </View>

                    
                    <View style={styles.space_large} />

                    <Text style={styles.normalText}>Session: {selectedSession}</Text>
                    <Text style={styles.normalText}>Swing:   {chosenSwing}</Text>

                    <Text style={styles.normalText}>Quaternion real:   {quaternion.real}</Text>
                    <Text style={styles.normalText}>Quaternion i:   {quaternion.i}</Text>
                    <Text style={styles.normalText}>Quaternion j:   {quaternion.j}</Text>
                    <Text style={styles.normalText}>Quaternion k:   {quaternion.k}</Text>
                    <Text style={styles.normalText}>Position x:   {position.x}</Text>
                    <Text style={styles.normalText}>Position y:   {position.y}</Text>
                    <Text style={styles.normalText}>Position z:   {position.z}</Text>

                    <Text style={{color: 'white', paddingBottom: 170}}>THIS IS TO GET SCROLL TO WORK</Text>

                </ScrollView>
            </View>
        );
    }
    else{
        return(
            <View style={styles.topContainer}>
            <Text style={styles.title}>Swing Visualization</Text>
            <View style={styles.lineUnderTitle}/>
            <View style={styles.space_medium} />
            <View style={styles.space_extra_large}/>
            <Text style={styles.normalText}> No Swings Found </Text>
            </View>
        );
    }
}


/** Corrects the raw slider value. Prevents the bug of it trying to find data for a time that we don't have any for
 * @example correctSliderValueAndSetStore(dispatch, 8, [1, 2, 3, 6, 9, 10, 15, 21, 23]);
 *          // This ^^^ sets currentTimeMilliseconds in the store
 *      Then, the time will be set to the next largest after the target, so in this case 9.
 * 
 * @param dispatch The dispatch hook
 * @param rawValue the raw value that the slider is set to
 * @param allSwingTimePoints An array of numbers that represent all points in time of the swing. THESE MUST BE IN ASCENDING ORDER
 */
 const correctSliderValueAndSetStore = (dispatch: Dispatch<AnyAction>, rawValue: number, allSwingTimePoints: Array<Number>) => {
    // Find the element that is the first one to be >= the raw value it tries to set to.
    // This ONLY works if allSwingTimePoints is in ascending order. 
    const element = allSwingTimePoints.find((time) => time >= rawValue);

    const newValue = element !== undefined ? element : rawValue

    dispatch(REDUCER_SET_CURRENT_TIME_IN_STORE(parseFloat(newValue.toFixed(6))));
};
