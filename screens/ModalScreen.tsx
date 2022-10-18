
import Slider from '@react-native-community/slider';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { Platform } from 'react-native';

import { Text, View } from '../components/Themed';
import { styles } from '../styles';
import { convertMillisToSeconds} from '../helpers/numberConversions';
import {
    setCurrentTime,
    selectCurrentTimeMilliseconds, 
} from '../store/timeSlice';


export default function ModalScreen() {
    const dispatch = useDispatch();
    const currentTimeMS = useSelector(selectCurrentTimeMilliseconds);


    return (
        <View style={styles.topContainer}>
            <Text style={styles.title}>Swing Visualization</Text>
            <View style={styles.lineUnderTitle}/>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />


        
            <View style={styles.space_extra_large}/>

            <Text style={styles.title}>
            Current Time: {convertMillisToSeconds(currentTimeMS).toFixed(3)}s
            </Text>

            <Slider 
                style={styles.slider} 
                onValueChange={(value) => dispatch(setCurrentTime(value))}
                maximumValue={300}
                minimumValue={0}
            />



        </View>
    );
}