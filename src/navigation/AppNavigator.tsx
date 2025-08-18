import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
    Home: undefined;
    AddPlant: undefined;
    PlantDetail: { plantId: string };
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
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
