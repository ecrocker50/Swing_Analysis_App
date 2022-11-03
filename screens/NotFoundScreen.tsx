import React from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';


export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Session in progress.</Text>
        <View style={styles.space_medium}></View>
        <Button title="End Session" onPress={() => {
        navigation.navigate('Root')
        }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 20,
        color: '#2e78b7',
    },
    space_medium: {
        height: "4%",
    },
});
