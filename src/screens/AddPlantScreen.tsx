import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addPlant } from '../services/database';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPlantScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [wateringInterval, setWateringInterval] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const loadSettings = async () => {
            const dark = await AsyncStorage.getItem('darkMode');
            if (dark !== null) setDarkMode(dark === 'true');
        };
        loadSettings();
    }, []);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Berechtigung benötigt', 'Bitte erlauben Sie den Zugriff auf die Galerie.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Berechtigung benötigt', 'Bitte erlauben Sie den Zugriff auf die Kamera.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const savePlant = async () => {
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
            await addPlant(name, location, interval, new Date().toISOString(), imageUri || '');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to save plant:', error);
            Alert.alert('Fehler', 'Pflanze konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.');
        }
    };

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            <Text style={[styles.label, darkMode && styles.darkText]}>Name</Text>
            <TextInput
                style={[styles.input, darkMode && styles.darkInput]}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor={darkMode ? '#aaa' : '#999'}
            />

            <Text style={[styles.label, darkMode && styles.darkText]}>Ort</Text>
            <TextInput
                style={[styles.input, darkMode && styles.darkInput]}
                value={location}
                onChangeText={setLocation}
                placeholder="Ort"
                placeholderTextColor={darkMode ? '#aaa' : '#999'}
            />

            <Text style={[styles.label, darkMode && styles.darkText]}>Gießintervall (Tage)</Text>
            <TextInput
                style={[styles.input, darkMode && styles.darkInput]}
                value={wateringInterval}
                onChangeText={setWateringInterval}
                keyboardType="numeric"
                placeholder="Tage"
                placeholderTextColor={darkMode ? '#aaa' : '#999'}
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                    <Text style={styles.photoButtonText}>Foto aufnehmen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                    <Text style={styles.photoButtonText}>Galerie</Text>
                </TouchableOpacity>
            </View>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

            <TouchableOpacity style={[styles.saveButton, darkMode && styles.darkSaveButton]} onPress={savePlant}>
                <Text style={styles.saveButtonText}>Pflanze speichern</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    darkContainer: { backgroundColor: '#121212' },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 12, color: '#000' },
    darkText: { color: '#fff' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
        color: '#000',
        backgroundColor: '#fff',
    },
    darkInput: {
        borderColor: '#555',
        color: '#fff',
        backgroundColor: '#1E1E1E',
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    photoButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 6,
        flex: 1,
        marginHorizontal: 4,
    },
    photoButtonText: { color: 'white', textAlign: 'center' },
    previewImage: { width: 100, height: 100, marginTop: 16, borderRadius: 8 },
    saveButton: {
        backgroundColor: 'green',
        padding: 14,
        borderRadius: 8,
        marginTop: 24,
    },
    darkSaveButton: { backgroundColor: '#388E3C' },
    saveButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});

export default AddPlantScreen;
