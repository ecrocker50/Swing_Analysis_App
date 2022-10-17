import { Button, SliderBase, SliderComponent, StyleSheet } from 'react-native';
import SelectList from 'react-native-dropdown-select-list'
import { useDispatch, useSelector } from 'react-redux';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { selectMode, setMode } from '../store/modeSelectSlice';
import { Mode } from '../types';
import { styles } from '../styles';
import { useState } from 'react';

const ModeOptions = ["Serve", "Forehand", "Backhand"];

export default function ModeSelectScreen({ navigation }: RootTabScreenProps<'ModeSelect'>) {
    const dispatch = useDispatch();
    const mode = useSelector(selectMode);
    const [selected, setSelected] = useState<Mode>("Forehand");

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select your mode!</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

            <SelectList
                placeholder={mode}
                data={ModeOptions}
                search={false}
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
