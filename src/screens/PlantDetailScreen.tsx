import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { getPlantById, updatePlant, deletePlant, Plant } from '../services/database';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper to schedule next watering notification
async function scheduleWateringNotification(plantName: string, interval: number) {
    const nextWatering = new Date();
    nextWatering.setDate(nextWatering.getDate() + interval);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "🌱 Erinnerung",
            body: `${plantName} sollte heute gegossen werden 💧`,
            sound: true,
        },
        trigger: nextWatering,
    });
}

const PlantDetailScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { plantId } = route.params as { plantId: number };

    const [plant, setPlant] = useState<Plant | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [wateringInterval, setWateringInterval] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            const dark = await AsyncStorage.getItem('darkMode');
            if (dark !== null) setDarkMode(dark === 'true');
        };
        loadSettings();
    }, []);

    useEffect(() => {
        const p = getPlantById(plantId);
        if (p) {
            setPlant(p);
            setName(p.name);
            setLocation(p.location);
            setWateringInterval(p.wateringInterval.toString());
            setImageUri(p.imageUri);
        }
    }, [plantId]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5, mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const saveChanges = async () => {
        if (!name || !wateringInterval) {
            Alert.alert('Fehler', 'Name und Gießintervall sind Pflichtfelder.');
            return;
        }
        const interval = parseInt(wateringInterval, 10);
        if (isNaN(interval) || interval <= 0) {
            Alert.alert('Fehler', 'Gießintervall muss eine positive Zahl sein.');
            return;
        }

        try {
            updatePlant(plantId, name, location, interval, plant?.lastWatered || new Date().toISOString(), imageUri || '');
            setPlant({ ...plant!, name, location, wateringInterval: interval, imageUri });
            setEditMode(false);

            await scheduleWateringNotification(name, interval);
            Alert.alert('Erfolg', 'Pflanze wurde aktualisiert.');
        } catch (error) {
            console.error('Error updating plant:', error);
            Alert.alert('Fehler', 'Pflanze konnte nicht aktualisiert werden.');
        }
    };

    const removePlant = () => {
        Alert.alert('Löschen', 'Möchten Sie diese Pflanze wirklich löschen?', [
            { text: 'Abbrechen', style: 'cancel' },
            {
                text: 'Löschen',
                style: 'destructive',
                onPress: () => {
                    deletePlant(plantId);
                    navigation.goBack();
                },
            },
        ]);
    };

    const waterToday = async () => {
        const today = new Date().toISOString();
        updatePlant(plantId, plant!.name, plant!.location, plant!.wateringInterval, today, plant!.imageUri || '');
        setPlant({ ...plant!, lastWatered: today });
        await scheduleWateringNotification(plant!.name, plant!.wateringInterval);
    };

    if (!plant) return <Text style={{ color: darkMode ? 'white' : 'black' }}>Pflanze nicht gefunden</Text>;

    const nextWateringDate = new Date(plant.lastWatered);
    nextWateringDate.setDate(nextWateringDate.getDate() + plant.wateringInterval);

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            <View style={styles.header}>
                <Text style={[styles.title, darkMode && styles.darkText]}>{plant.name}</Text>
            </View>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

            {editMode && (
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                    <Text style={styles.photoButtonText}>Foto ändern</Text>
                </TouchableOpacity>
            )}

            <View style={styles.infoContainer}>
                {editMode ? (
                    <>
                        <TextInput
                            style={[styles.input, darkMode && styles.darkInput]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Name"
                            placeholderTextColor={darkMode ? '#aaa' : '#999'}
                        />
                        <TextInput
                            style={[styles.input, darkMode && styles.darkInput]}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Standort"
                            placeholderTextColor={darkMode ? '#aaa' : '#999'}
                        />
                        <TextInput
                            style={[styles.input, darkMode && styles.darkInput]}
                            value={wateringInterval}
                            onChangeText={setWateringInterval}
                            placeholder="Gießintervall (Tage)"
                            placeholderTextColor={darkMode ? '#aaa' : '#999'}
                            keyboardType="numeric"
                        />
                    </>
                ) : (
                    <>
                        <Text style={[styles.name, darkMode && styles.darkText]}>{plant.name}</Text>
                        <Text style={darkMode && styles.darkText}>Standort: {plant.location}</Text>
                        <Text style={darkMode && styles.darkText}>Intervall: alle {plant.wateringInterval} Tage</Text>
                        <Text style={darkMode && styles.darkText}>letztes Gießen: {new Date(plant.lastWatered).toLocaleDateString()}</Text>
                        <Text style={darkMode && styles.darkText}>nächstes Mal: {nextWateringDate.toLocaleDateString()}</Text>
                    </>
                )}
            </View>

            {editMode ? (
                <>
                    <TouchableOpacity style={[styles.saveButton, darkMode && styles.darkSaveButton]} onPress={saveChanges}>
                        <Text style={styles.saveButtonText}>Änderungen speichern</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)}>
                        <Text style={styles.cancelButtonText}>Abbrechen</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity style={[styles.waterButton, darkMode && styles.darkWaterButton]} onPress={waterToday}>
                        <Text style={styles.waterButtonText}>heute gegossen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.editPlantButton, darkMode && styles.darkEditButton]} onPress={() => setEditMode(true)}>
                        <Text style={styles.editPlantButtonText}>Pflanze editieren</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={removePlant}>
                        <Text style={styles.deleteButtonText}>Pflanze löschen</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    darkContainer: { backgroundColor: '#121212' },
    header: { marginBottom: 16 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    darkText: { color: '#fff' },
    previewImage: { width: '100%', height: 300, borderRadius: 8 },
    photoButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        marginTop: 12,
        borderRadius: 6,
    },
    photoButtonText: { color: 'white', textAlign: 'center' },
    infoContainer: { marginTop: 16 },
    name: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 8, color: 'black' },
    darkInput: { borderColor: '#555', color: '#fff', backgroundColor: '#1E1E1E' },
    waterButton: { backgroundColor: 'green', padding: 14, marginTop: 24, borderRadius: 8 },
    darkWaterButton: { backgroundColor: '#388E3C' },
    waterButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    saveButton: { backgroundColor: 'green', padding: 14, marginTop: 24, borderRadius: 8 },
    darkSaveButton: { backgroundColor: '#388E3C' },
    saveButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#9E9E9E', padding: 14, marginTop: 12, borderRadius: 8 },
    cancelButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    editPlantButton: { backgroundColor: '#FF9800', padding: 14, marginTop: 12, borderRadius: 8 },
    darkEditButton: { backgroundColor: '#F57C00' },
    editPlantButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
    deleteButton: { backgroundColor: 'red', padding: 14, marginTop: 12, borderRadius: 8 },
    deleteButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});

export default PlantDetailScreen;
