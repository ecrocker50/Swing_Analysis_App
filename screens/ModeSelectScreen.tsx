import { Button } from 'react-native';
import SelectList from 'react-native-dropdown-select-list'
import { useDispatch, useSelector } from 'react-redux';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { selectMode, setMode } from '../store/modeSelectSlice';
import { Mode } from '../types';
import { styles } from '../styles';
import { useState } from 'react';

const ModeOptions: Array<Mode> = ["Forehand", "Backhand", "Serve"];


export default function ModeSelectScreen({ navigation }: RootTabScreenProps<'ModeSelect'>) {
    const dispatch = useDispatch();
    const mode = useSelector(selectMode);
    const [selected, setSelected] = useState<Mode>(ModeOptions[0]);

    return (
        <View style={styles.topContainer}>
            <Text style={{...styles.title}}>Select your mode!</Text>
            <View style={styles.lineUnderTitle} />

            {ModeDescriptions(mode)}
            
            <View style={styles.space_small} />

            <SelectList
                placeholder={mode}
                data={ModeOptions}
                search={false}
                boxStyles={styles.dropdownUnopened}
                dropdownStyles={styles.dropdown}
                dropdownItemStyles={styles.dropdownItem}
                dropdownTextStyles={styles.dropdownText}
                inputStyles={styles.dropdownSelectedText}
                setSelected={setSelected}
                onSelect={() => dispatch(setMode(selected))}
            />

            <View style={styles.space_small} />

            <Button title="Log mode" onPress={() => console.log(mode)}></Button>       
        </View>
    );
}



/** Generates a text element to display based on the selected mode. Contains descriptions and such
 * 
 * @param mode The mode that the app is in (forehand, backhand, etc)
 * @returns JSX.Element - the text element to display for the specific mode
 */
function ModeDescriptions(mode: Mode): JSX.Element {
    let textComponent;
    const textStyle = styles.regularText;

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
}