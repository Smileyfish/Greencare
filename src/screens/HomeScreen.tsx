import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getPlantsSync, Plant, initDB } from '../services/database';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const isFocused = useIsFocused();
    const navigation = useNavigation();

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
                    <Ionicons name="settings-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

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
            <View style={styles.plantItem}>
                {item.imageUri ? (
                    <Image source={{ uri: item.imageUri }} style={styles.plantImage} />
                ) : (
                    <View style={[styles.plantImage, styles.placeholder]} />
                )}
                <View style={styles.plantInfo}>
                    <Text style={styles.plantName}>{item.name}</Text>
                    <Text style={styles.plantLocation}>{item.location}</Text>
                </View>
                <Text style={styles.nextWatering}>{calculateNextWatering(item.lastWatered, item.wateringInterval)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {plants.length === 0 ? (
                <Text style={styles.emptyText}>Noch keine Pflanzen hinzugefügt</Text>
            ) : (
                <FlatList
                    data={plants}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPlantItem}
                />
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddPlant' as never)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
    plantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 8,
    },
    plantImage: { width: 60, height: 60, borderRadius: 8 },
    placeholder: { backgroundColor: '#ccc' },
    plantInfo: { flex: 1, marginLeft: 12 },
    plantName: { fontWeight: 'bold', fontSize: 16 },
    plantLocation: { color: '#555' },
    nextWatering: { fontWeight: 'bold', marginLeft: 8, color: '#4caf50' },
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
    addButtonText: { color: 'white', fontSize: 28, lineHeight: 28 },
});

export default HomeScreen;
