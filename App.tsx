import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { store } from './store/store'

// const firebaseConfig = {
//     apiKey: "AIzaSyAco6QlMVq2XUul6wCGy2vKa2SClWFmo3E",
//     authDomain: "swinganalysis-47b58.firebaseapp.com",
//     projectId: "swinganalysis-47b58",
//     storageBucket: "swinganalysis-47b58.appspot.com",
//     messagingSenderId: "982706473211",
//     appId: "1:982706473211:web:1003a52463538806f2485e"
// };

// firebase.initializeApp(firebaseConfig);

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
        <Provider store={store}>
            <SafeAreaProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
            </SafeAreaProvider>
        </Provider>
        );
    }
}
