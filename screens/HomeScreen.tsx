import SelectList from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { styles } from '../styles';
import React, { useState } from 'react';
import {
    crappyDataMock,
    getAllSessionNames,
    getSwingsInsideSession
} from '../helpers/userDataHelpers';
import { Button } from 'react-native';





export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
    const [selectedSession, setSelectedSession] = useState<string>("");
    const [selectedSwing,   setSelectedSwing]   = useState<number>(-1);

    const navigationHook = useNavigation();


    return (
        <View style={styles.topContainer}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.lineUnderTitle} />

        <View style={styles.space_extra_large} />

        {chooseASessionSection(selectedSession, setSelectedSession)}
        <View style={styles.space_medium} />
        {chooseASwingSection(selectedSwing, setSelectedSwing, selectedSession)}
        <View style={styles.space_extra_large} />
        {viewSwingButton(selectedSwing, navigationHook)}

        </View>
    );
}






const chooseASessionSection = (selectedSession: string, setSelectedSession: React.Dispatch<React.SetStateAction<string>>): JSX.Element => {
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
                setSelected={setSelectedSession}
                onSelect={() => console.log("")}
            />
        </View>
    );
}


const chooseASwingSection = (selectedSwing: number, setselectedSwing: React.Dispatch<React.SetStateAction<number>>, selectedSession: string): JSX.Element => {
    const swings = getSwingsInsideSession(crappyDataMock, selectedSession);
    const swingIndexArray = Array.apply(null, Array(swings.length)).map((value, index) => index);

    const placeholderDisplay = selectedSwing !== -1 ? selectedSwing.toString() : "select";

    if (selectedSession) {
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
                    setSelected={setselectedSwing}
                    onSelect={() => console.log(selectedSwing)}
                />
            </View>
        );
    }
    else {
        return <View></View>;
    }
}





const viewSwingButton = (selectedSwing: number, navigation: any): JSX.Element => {
    if (selectedSwing !== -1) {
        return (
            <View>
                <Button title="Visualize Swing" onPress={() => navigation.navigate('Modal')}></Button>
            </View>
        );
    }
    else {
        return (
            <View></View>
        );
    }
}







