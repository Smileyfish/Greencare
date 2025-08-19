import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getPlantsSync, Plant, initDB } from '../services/database';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const [darkMode, setDarkMode] = useState(false);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        const loadSettings = async () => {
            const dark = await AsyncStorage.getItem('darkMode');
            if (dark !== null) setDarkMode(dark === 'true');
        };
        loadSettings();
    }, []);

    useEffect(() => {
        initDB();
        if (isFocused) {
            const plantsList: Plant[] = getPlantsSync();
            setPlants(plantsList);
        }
    }, [isFocused]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)} style={{ marginRight: 16 }}>
                    <Ionicons name="settings-outline" size={24} color={darkMode ? 'white' : 'black'} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, darkMode]);

    const calculateNextWatering = (lastWatered: string, interval: number) => {
        const last = new Date(lastWatered);
        const next = new Date(last);
        next.setDate(last.getDate() + interval);
        const diff = Math.ceil((next.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 0) return 'heute';
        return `in ${diff} Tagen`;
    };

    const renderPlantItem = ({ item }: { item: Plant }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('PlantDetail' as never, { plantId: item.id } as never)}
        >
            <View style={[styles.plantItem, darkMode && styles.darkPlantItem]}>
                {item.imageUri ? (
                    <Image source={{ uri: item.imageUri }} style={styles.plantImage} />
                ) : (
                    <View style={[styles.plantImage, styles.placeholder, darkMode && styles.darkPlaceholder]} />
                )}
                <View style={styles.plantInfo}>
                    <Text style={[styles.plantName, darkMode && styles.darkText]}>{item.name}</Text>
                    <Text style={[styles.plantLocation, darkMode && styles.darkText]}>{item.location}</Text>
                </View>
                <Text style={[styles.nextWatering, darkMode && styles.darkNextWatering]}>
                    {calculateNextWatering(item.lastWatered, item.wateringInterval)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            {plants.length === 0 ? (
                <Text style={[styles.emptyText, darkMode && styles.darkText]}>Noch keine Pflanzen hinzugefügt</Text>
            ) : (
                <FlatList
                    data={plants}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPlantItem}
                />
            )}

            <TouchableOpacity
                style={[styles.addButton, darkMode && styles.darkAddButton]}
                onPress={() => navigation.navigate('AddPlant' as never)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    darkContainer: { backgroundColor: '#121212' },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
    plantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 8,
    },
    darkPlantItem: { backgroundColor: '#1E1E1E' },
    plantImage: { width: 60, height: 60, borderRadius: 8 },
    placeholder: { backgroundColor: '#ccc' },
    darkPlaceholder: { backgroundColor: '#333' },
    plantInfo: { flex: 1, marginLeft: 12 },
    plantName: { fontWeight: 'bold', fontSize: 16 },
    plantLocation: { color: '#555' },
    nextWatering: { fontWeight: 'bold', marginLeft: 8, color: '#4caf50' },
    darkNextWatering: { color: '#81C784' },
    darkText: { color: '#fff' },
    addButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: 'green',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    darkAddButton: { backgroundColor: '#388E3C' },
    addButtonText: { color: 'white', fontSize: 28, lineHeight: 28 },
});

export default HomeScreen;
