import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

const SettingsScreen: React.FC = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [notifications, setNotifications] = React.useState(true); // Keep notifications local for now

    // If you want notifications to be global, move to context as well
    // For now, keep AsyncStorage for notifications only
    React.useEffect(() => {
        const loadNotifications = async () => {
            try {
                const notif = await AsyncStorage.getItem('notifications');
                if (notif !== null) setNotifications(notif === 'true');
            } catch (error) {
                console.log('Error loading notifications', error);
            }
        };
        loadNotifications();
    }, []);

    const toggleNotifications = async () => {
        const newValue = !notifications;
        setNotifications(newValue);
        try {
            await AsyncStorage.setItem('notifications', newValue.toString());
        } catch (error) {
            console.log('Error saving notifications', error);
        }
    };

    return (
        <ScrollView style={[styles.container, darkMode && styles.darkContainer]}>
            <View style={styles.settingRow}>
                <Text style={[styles.label, darkMode && styles.darkText]}>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
            </View>

            <View style={styles.settingRow}>
                <Text style={[styles.label, darkMode && styles.darkText]}>Notifications</Text>
                <Switch value={notifications} onValueChange={toggleNotifications} />
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
