import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { THREE } from 'expo-three';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { store } from './store/store'
import { LogBox } from 'react-native';

(global as any).THREE = (global as any).THREE || THREE;
LogBox.ignoreLogs(['new NativeEventEmitter']);

export default function App() {
    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
        <Provider store={store}>
            <SafeAreaProvider>
                <Navigation colorScheme={'light'} />
                <StatusBar />
            </SafeAreaProvider>
        </Provider>
        );
    }
}
