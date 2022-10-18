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


    // Sliders
    slider: {
        width: "80%",
    },


    // Containers
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topContainer: {
        flex: 1,
        paddingTop: 15,
        alignItems: 'center',
    },

    
    // Text
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    normalText: {
        fontSize: 18,
        marginRight: 15,
        marginLeft: 15
    },

    
    // Separating Lines
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    lineUnderTitle: {
        marginBottom: 15,
        marginTop: 5,
        height: 1,
        width: '80%',
        backgroundColor: '#444444'
    },

    
    // Vertical Spacing
    space_extra_small: {
        height: "1%",
    },
    space_small: {
        height: "2%",
    },
    space_medium: {
        height: "4%",
    },
    space_large: {
        height: "6%",
    },
    space_extra_large: {
        height: "10%",
    },
});