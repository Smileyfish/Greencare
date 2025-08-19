import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { ThemeContext } from '../context/ThemeContext';

export type RootStackParamList = {
    Home: undefined;
    AddPlant: undefined;
    PlantDetail: { plantId: string };
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const { darkMode } = useContext(ThemeContext);

    return (
        <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Meine Pflanzen' }} />
                <Stack.Screen name="AddPlant" component={AddPlantScreen} options={{ title: 'Pflanze hinzufügen' }} />
                <Stack.Screen name="PlantDetail" component={PlantDetailScreen} options={{ title: 'Pflanzendetails' }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Einstellungen' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
