import { StyleSheet } from "react-native";



export const styles = StyleSheet.create({

    // Drop Down
    dropdown: {
        flex: 1,
        fontSize: 20,
        
    },
    dropdownItem: {
        flex: 1,
        
    },
    dropdownText: {
        fontSize: 20,
        
    },
    dropdownSelectedText: {
        fontSize: 20,
    },


    // Containers
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    
    // Text
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    
    // Separating Lines
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
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