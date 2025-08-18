import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const dark = await AsyncStorage.getItem('darkMode');
            const notif = await AsyncStorage.getItem('notifications');
            if (dark !== null) setDarkMode(dark === 'true');
            if (notif !== null) setNotifications(notif === 'true');
        };
        loadSettings();
    }, []);

    const toggleDarkMode = async () => {
        const newValue = !darkMode;
        setDarkMode(newValue);
        await AsyncStorage.setItem('darkMode', newValue.toString());
    };

    const toggleNotifications = async () => {
        const newValue = !notifications;
        setNotifications(newValue);
        await AsyncStorage.setItem('notifications', newValue.toString());
    };

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            <View style={styles.settingRow}>
                <Text style={[styles.label, darkMode && styles.darkText]}>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
            </View>

            <View style={styles.settingRow}>
                <Text style={[styles.label, darkMode && styles.darkText]}>Notifications</Text>
                <Switch value={notifications} onValueChange={toggleNotifications} />
            </View>
        </View>
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
