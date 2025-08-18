import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddPlantScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Pflanze hinzufügen - Platzhalter</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default AddPlantScreen;
