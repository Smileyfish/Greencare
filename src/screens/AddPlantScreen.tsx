import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addPlant } from '../services/database';
import { useNavigation } from '@react-navigation/native';

const AddPlantScreen: React.FC = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [wateringInterval, setWateringInterval] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const navigation = useNavigation();

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

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
        });

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
        <View style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Ort</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} />

            <Text style={styles.label}>Gießintervall (Tage)</Text>
            <TextInput
                style={styles.input}
                value={wateringInterval}
                onChangeText={setWateringInterval}
                keyboardType="numeric"
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

            <TouchableOpacity style={styles.saveButton} onPress={savePlant}>
                <Text style={styles.saveButtonText}>Pflanze speichern</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 12 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
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
    saveButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});

export default AddPlantScreen;