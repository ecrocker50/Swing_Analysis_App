import { buttonColor, buttonCyan, buttonGreen, buttonMagenta, styles } from "../styles";
import { Mode } from "../types";

export const getButtonStyle = (mode: Mode): any => {
    if (mode === 'Forehand') {
        return styles.buttonMagenta;
    } 
    else if (mode === 'Backhand') {
        return styles.buttonCyan;
    }
    else if (mode === 'Serve') {
        return styles.buttonGreen;
    }

    return styles.buttonRegular;
};


export const getModeColor = (mode: Mode): string => {
    if (mode === 'Forehand') {
        return buttonMagenta;
    } 
    else if (mode === 'Backhand') {
        return buttonCyan;
    }
    else if (mode === 'Serve') {
        return buttonGreen;
    }

    return buttonColor;
};