import { StyleSheet } from "react-native";

const tintColorLight = '#2f95dc';
export const buttonColor = '#2196F3';
const buttonRed = '#ff3333';
const buttonRadius = 20;
export const buttonMagenta = '#00cccc';
export const buttonGreen = '#00cc00';
export const buttonCyan = '#e600e6';

export const styles = StyleSheet.create({

    // Drop Down
    dropdown: {
        width: '60%', 
        alignSelf: 'center', 
        borderRadius: 20
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
    bigText:  {
        fontSize: 48,
        fontWeight: 'bold'
    },

    // Text Input
    textInputSessionName: {
        borderWidth: 1, 
        height: 50, 
        width: 200, 
        paddingLeft: 15, 
        fontSize: 20, 
        borderRadius: 8,
        backgroundColor: 'white',
        marginTop: 20,
        alignSelf: 'center'
    },


    // Sliders
    slider: {
        width: "80%",
        alignSelf: 'center',
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
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowRadius: 7,
        elevation: 5,
        color: 'white'
    },
    jumbotron_gray: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#EEEEEE',
        borderRadius: 25
    },

    // Button
    buttonRegular: {
        borderRadius: buttonRadius,
        backgroundColor: buttonColor
    },
    buttonRed: {
        borderRadius: buttonRadius,
        backgroundColor: buttonRed
    },
    buttonMagenta: {
        borderRadius: buttonRadius,
        backgroundColor: buttonMagenta
    },
    buttonGreen: {
        borderRadius: buttonRadius,
        backgroundColor: buttonGreen
    },
    buttonCyan: {
        borderRadius: buttonRadius,
        backgroundColor: buttonCyan
    },

    
    // Text
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tintColorLight,
        marginLeft: 15,
        textDecorationLine: 'underline'
    },
    titleCenterNoUnder: {
        fontSize: 20,
        fontWeight: 'bold',
        color: tintColorLight
    },
    normalText: {
        fontSize: 18,
        marginRight: 15,
        marginLeft: 15
    },
    errorText: {
        fontSize: 18,
        marginRight: 15,
        marginLeft: 15,
        color: 'red'
    },
    boldText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#fff',
        marginHorizontal: 13,
        marginVertical: 10,
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '700'
    },

    
    // Separating Lines
    separator: {
        // marginVertical: 30,
        height: 1,
        width: '80%',
        backgroundColor: '#AAAAAA',
        alignSelf: 'center'
    },
    lineUnderTitle: {
        marginBottom: 15,
        marginTop: 5,
        height: 1,
        width: '80%',
        backgroundColor: '#AAAAAA',
        alignSelf: 'center'
    },
    fullSeparator: {
        height: 1,
        width: '100%',
        backgroundColor: '#AAAAAA',
        alignSelf: 'center'
    },

    
    // Vertical Spacing
    space_extra_small: {
        height: "1%",
        backgroundColor: 'transparent'
    },
    space_small: {
        height: "2%",
        backgroundColor: 'transparent'
    },
    space_medium: {
        height: "4%",
        backgroundColor: 'transparent'
    },
    space_large: {
        height: "6%",
        backgroundColor: 'transparent'
    },
    space_extra_large: {
        height: "10%",
        backgroundColor: 'transparent'
    },
});