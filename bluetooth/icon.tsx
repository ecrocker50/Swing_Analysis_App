import { MaterialIcons } from '@expo/vector-icons';


/** Gets the ble status icon you see in the top right of the screens
 * 
 * @param wasLastConnectAttemptSuccess Was the last ble connection attempt successful. Can be obtained using SELECTOR_WAS_LAST_CONNECT_SUCCESS in the slice
 * @returns The JSX.Element of the ble icon
 */
export const bleStatusComponent = (wasLastConnectAttemptSuccess: boolean): JSX.Element => {
    if (wasLastConnectAttemptSuccess) {
        return <MaterialIcons name={'bluetooth'} color={'black'} size={27} style={{marginRight: 10, marginTop: 10}} />;
    }

    return <MaterialIcons name={'bluetooth-disabled'} color={'gray'} size={27} style={{marginRight: 10, marginTop: 10}} />;
};