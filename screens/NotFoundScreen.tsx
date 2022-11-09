import React from 'react';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';
import { styles } from '../styles';




export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ERROR - Screen not found!!</Text>
        </View>
    );
}





