import { MaterialIcons } from '@expo/vector-icons';


export const bleStatusComponent = (wasLastConnectAttemptSuccess: boolean): JSX.Element => {
    if (wasLastConnectAttemptSuccess) {
        return <MaterialIcons name={'bluetooth'} color={'black'} size={27} style={{marginRight: 10, marginTop: 10}} />;
    }

    return <MaterialIcons name={'bluetooth-disabled'} color={'gray'} size={27} style={{marginRight: 10, marginTop: 10}} />;
};