/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Text, View } from '../components/Themed';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import SwingVisualizeScreen from '../screens/SwingVisualizeScreen';
import RecordedSessionsScreen from '../screens/RecordedSessionsScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import Settings from '../screens/SettingsScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { getBatteryPercentageComponent, getBatteryPercentageIcon } from '../helpers/batteryVoltageMethods';
import { useSelector } from 'react-redux';
import { SELECTOR_BATTERY_PERCENT } from '../store/batteryPercentageSlice';
import SessionInProgressScreen from '../screens/SessionInProgressScreen';
import { SELECTOR_WAS_LAST_CONNECT_SUCCESS } from '../store/bleSlice';
import { bleStatusComponent } from '../bluetooth/icon';


export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
        //    theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const batteryPercent = useSelector(SELECTOR_BATTERY_PERCENT);
  const wasLastBluetoothConnectSuccess = useSelector(SELECTOR_WAS_LAST_CONNECT_SUCCESS);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
        name="SessionInProgress" 
        component={SessionInProgressScreen}
        options={() => ({
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              { bleStatusComponent(wasLastBluetoothConnectSuccess) }
            </View>
          ) 
        })}
         />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
        name="SwingVisualize" 
        component={SwingVisualizeScreen} 
        options={() => ({
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              { bleStatusComponent(wasLastBluetoothConnectSuccess) }
              { getBatteryPercentageComponent(batteryPercent, wasLastBluetoothConnectSuccess) }
            </View>
          ) 
        })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const batteryPercent = useSelector(SELECTOR_BATTERY_PERCENT);
  const wasLastBluetoothConnectSuccess = useSelector(SELECTOR_WAS_LAST_CONNECT_SUCCESS);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              { bleStatusComponent(wasLastBluetoothConnectSuccess) }
              { getBatteryPercentageComponent(batteryPercent, wasLastBluetoothConnectSuccess) }
            </View>
          )
        })}
      />
      <BottomTab.Screen
        name="RecordedSessions"
        component={RecordedSessionsScreen}
        options={({ navigation }: RootTabScreenProps<'RecordedSessions'>) => ({
          title: 'Recorded Sessions',
          tabBarIcon: ({ color }) => <TabBarIcon name="file-text" color={color} />,
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              { bleStatusComponent(wasLastBluetoothConnectSuccess) }
              { getBatteryPercentageComponent(batteryPercent, wasLastBluetoothConnectSuccess) }
            </View>
          )
        })}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              { bleStatusComponent(wasLastBluetoothConnectSuccess) }
              { getBatteryPercentageComponent(batteryPercent, wasLastBluetoothConnectSuccess) }
            </View>
          )
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
