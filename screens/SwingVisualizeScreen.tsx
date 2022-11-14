import React, { Dispatch, useState } from 'react';
import Slider from '@react-native-community/slider';
import SelectList from 'react-native-dropdown-select-list';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Platform } from 'react-native';
import { AnyAction } from '@reduxjs/toolkit';
import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { doesSessionHaveSwings, getMaxTimeOfSwing, getPosition, getQuaternion, getSwingsInsideSession, getTimeOfContact, getTimesOfAllPointsInSwing } from '../helpers/userDataMethods/userDataRead';
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
import { UserSessionsData } from '../types';
import { convertQuaternionToEuler } from '../helpers/numberConversions';



export default function SwingVisualizeScreen() {
    const dispatch = useDispatch();
    
    //const {selectedSession} = route.params
    const currentTimeSeconds   = useSelector(SELECTOR_CURRENT_TIME_SECONDS);
    const selectedSession = useSelector(SELECTOR_SELECTED_SESSION);
    //const selectedSwing   = useSelector(SELECTOR_SELECTED_SWING);
    const userSessions    = useSelector(SELECTOR_USER_SESSIONS);
    const [chosenSwing,   setChosenSwing]   = useState<number>(0);

    const quaternion  = getQuaternion(userSessions, selectedSession, chosenSwing, currentTimeSeconds);
    const position    = getPosition(userSessions, selectedSession, chosenSwing, currentTimeSeconds);
    const eulerAngles = convertQuaternionToEuler(quaternion);
    
    if(chosenSwing !== -1)
    {
        //console.log("delete")
        const allSwingTimePoints = getTimesOfAllPointsInSwing(userSessions, selectedSession, chosenSwing);
        const maxSwingValue = getMaxTimeOfSwing(userSessions, selectedSession, chosenSwing);
        const swings = getSwingsInsideSession(userSessions, selectedSession).length;
        return (
            <View style={styles.topContainer}>
            <Text style={styles.title}>Swing Visualization</Text>
            <View style={styles.lineUnderTitle}/>
            <View style={styles.space_medium} />

            {chooseASwingSection(dispatch, selectedSession, userSessions, chosenSwing, setChosenSwing)}

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

        
            <View style={styles.space_extra_large}/>

            <Text style={styles.title}>
                Current Time: {currentTimeSeconds.toFixed(6)}s
            </Text>

            <Slider 
                style={styles.slider} 
                onValueChange={(value) => correctSliderValueAndSetStore(dispatch, value, allSwingTimePoints)}
                maximumValue={maxSwingValue}
                minimumValue={0}
            />

            <Text style={styles.normalText}>Session: {selectedSession}</Text>
            <Text style={styles.normalText}>Swing:   {chosenSwing}</Text>

            <Text style={styles.normalText}>Time of Contact: {getTimeOfContact(userSessions, selectedSession, chosenSwing)}s</Text>
            <Text style={styles.normalText}>Quaternion real:   {quaternion.real}</Text>
            <Text style={styles.normalText}>Quaternion i:   {quaternion.i}</Text>
            <Text style={styles.normalText}>Quaternion j:   {quaternion.j}</Text>
            <Text style={styles.normalText}>Quaternion k:   {quaternion.k}</Text>
            <Text style={styles.normalText}>Roll:    {eulerAngles.roll}</Text>
            <Text style={styles.normalText}>Pitch:   {eulerAngles.pitch}</Text>
            <Text style={styles.normalText}>Yaw:     {eulerAngles.yaw}</Text>
            <Text style={styles.normalText}>Position x:   {position.x}</Text>
            <Text style={styles.normalText}>Position y:   {position.y}</Text>
            <Text style={styles.normalText}>Position z:   {position.z}</Text>
            <View style={styles.space_medium} />
            <View style={{flexDirection: 'row'}}>
            <Button title="Prev" color='red'
                onPress={() => {
                    if(chosenSwing > 0)
                    {
                        setChosenSwing(chosenSwing-1)
                        dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing));
                    }
                }} />
            <View style={styles.space_small} />
            <Button title="Next" color='green' 
                onPress={() => {
                    if(chosenSwing < getSwingsInsideSession(userSessions, selectedSession).length - 1)
                    {
                        setChosenSwing(chosenSwing+1);
                        dispatch(REDUCER_SET_SELECTED_SWING_IN_STORE(chosenSwing));
                    }
                }} />
                </View>
                <View style={styles.space_small} />
                <Button 
                            color='red' 
                            title="Delete Swing" 
                            onPress={() => {
                                //console.log("button");
                                dispatch(REDUCER_REMOVE_SWING_FROM_SESSION_IN_STORE({sessionName: selectedSession, swingIndex: chosenSwing}));
                                //console.log("reducer");
                                //console.log(doesSessionHaveSwings(userSessions, selectedSession));
                                if(doesSessionHaveSwings(userSessions, selectedSession) === 1)
                                {
                                    //console.log("-1");
                                    setChosenSwing(-1);
                                }
                                else
                                {
                                    if(chosenSwing === 0)
                                    {
                                        //console.log("0");
                                        //console.log(chosenSwing);
                                        setChosenSwing(chosenSwing);
                                    }
                                    else
                                    {
                                        //console.log("subtract");
                                        setChosenSwing(chosenSwing-1);
                                    }
                                }
                            }
                            }
                        />
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
        )

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

const chooseASwingSection = (dispatch: Dispatch<AnyAction>, selectedSession: string, userSessionsData: UserSessionsData, chosenSwing: number, setChosenSwing: React.Dispatch<React.SetStateAction<number>>): JSX.Element => {
    const swings = getSwingsInsideSession(userSessionsData, selectedSession);
    const swingIndexArray = Array.apply(null, Array(swings.length)).map((value, index) => index);

    const placeholderDisplay = chosenSwing !== -1 ? chosenSwing.toString() : "select";
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


