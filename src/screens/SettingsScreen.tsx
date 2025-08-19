import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    // Load settings from AsyncStorage on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const dark = await AsyncStorage.getItem('darkMode');
                const notif = await AsyncStorage.getItem('notifications');
                if (dark !== null) setDarkMode(dark === 'true');
                if (notif !== null) setNotifications(notif === 'true');
            } catch (error) {
                console.log('Error loading settings', error);
            }
        };
        loadSettings();
    }, []);

    // Generic toggle function
    const toggleSetting = async (key: string, value: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        const newValue = !value;
        setter(newValue);
        try {
            await AsyncStorage.setItem(key, newValue.toString());
        } catch (error) {
            console.log(`Error saving ${key}`, error);
        }
    };

    return (
        <ScrollView style={[styles.container, darkMode && styles.darkContainer]}>
            <View style={styles.settingRow}>
                <Text style={[styles.label, darkMode && styles.darkText]}>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={() => toggleSetting('darkMode', darkMode, setDarkMode)} />
            </View>

            <View style={styles.settingRow}>
                <Text style={[styles.label, darkMode && styles.darkText]}>Notifications</Text>
                <Switch value={notifications} onValueChange={() => toggleSetting('notifications', notifications, setNotifications)} />
            </View>

            {/* Placeholder for future settings */}
            {/* Example: <View style={styles.settingRow}> ... </View> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    darkContainer: { backgroundColor: '#121212' },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 },
    label: { fontSize: 16, fontWeight: 'bold' },
    darkText: { color: '#fff' },
});

export default SettingsScreen;
