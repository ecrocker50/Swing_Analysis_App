import { StyleSheet } from "react-native";



export const styles = StyleSheet.create({

    // Drop Down
    dropdownUnopened: {
        width: 200
    },
    dropdown: {
        fontSize: 20,
    },
    dropdownItem: {
        width: "100%"
    },
    dropdownText: {
        fontSize: 20,
    },
    dropdownSelectedText: {
        fontSize: 20,
    },

    // Text Input
    textInputSessionName: {
        borderWidth: 1, 
        height: 50, 
        width: 200, 
        paddingLeft: 5, 
        fontSize: 20, 
        borderRadius: 8
    },


    // Sliders
    slider: {
        width: "80%",
        alignSelf: 'center'
    },


    // Containers
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    topContainer: {
        flex: 1,
        paddingTop: 15,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    modalView: {
        marginTop: 150,
        height: 200,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowRadius: 7,
        elevation: 5,
        color: 'white'
    },

    
    // Text
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center'
    },
    normalText: {
        fontSize: 18,
        marginRight: 15,
        marginLeft: 15,
        color: 'black'
    },

    
    // Separating Lines
    separator: {
        // marginVertical: 30,
        height: 1,
        width: '80%',
        backgroundColor: '#444444',
        alignSelf: 'center'
    },
    fullSeparator: {
        // marginVertical: 30,
        height: 1,
        width: '100%',
        backgroundColor: '#444444',
        alignSelf: 'center'
    },
    lineUnderTitle: {
        marginBottom: 15,
        marginTop: 5,
        height: 1,
        width: '80%',
        backgroundColor: '#444444',
        alignSelf: 'center'
    },

    
    // Vertical Spacing
    space_extra_small: {
        height: "1%",
    },
    space_small: {
        height: "2%",
    },
    space_medium: {
        height: "4%"
    },
    space_large: {
        height: "6%",
    },
    space_extra_large: {
        height: "10%"
    },
});