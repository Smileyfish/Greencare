import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('plants.db');

export interface Plant {
    id: number;
    name: string;
    location: string;
    wateringInterval: number;
    lastWatered: string;
    imageUri: string;
}

export const initDB = () => {
    try {
        db.execSync(`
            CREATE TABLE IF NOT EXISTS plants (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                location TEXT,
                wateringInterval INTEGER,
                lastWatered TEXT,
                imageUri TEXT
            );
        `);
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Initialize database
initDB();

export const getPlantsSync = (): Plant[] => {
    try {
        const result = db.getAllSync(`
            SELECT * FROM plants;
        `) as Plant[];
        return result.map((row) => ({
            id: row.id,
            name: row.name,
            location: row.location || '',
            wateringInterval: row.wateringInterval || 0,
            lastWatered: row.lastWatered || '',
            imageUri: row.imageUri || '',
        }));
    } catch (error) {
        console.error('Error fetching plants:', error);
        return [];
    }
};

export const addPlant = (
    name: string,
    location: string,
    wateringInterval: number,
    lastWatered: string,
    imageUri: string
) => {
    try {
        db.runSync(
            `INSERT INTO plants (name, location, wateringInterval, lastWatered, imageUri) VALUES (?, ?, ?, ?, ?);`,
            [name, location, wateringInterval, lastWatered, imageUri]
        );
    } catch (error) {
        console.error('Error adding plant:', error);
        throw error;
    }
};

// Get plant by ID
export const getPlantById = (id: number): Plant | null => {
    try {
        const result = db.getAllSync(`SELECT * FROM plants WHERE id = ?;`, [id]) as Plant[];
        if (result.length === 0) return null;
        const row = result[0];
        return {
            id: row.id,
            name: row.name,
            location: row.location || '',
            wateringInterval: row.wateringInterval || 0,
            lastWatered: row.lastWatered || '',
            imageUri: row.imageUri || '',
        };
    } catch (error) {
        console.error('Error fetching plant by ID:', error);
        return null;
    }
};

// Update plant
export const updatePlant = (
    id: number,
    name: string,
    location: string,
    wateringInterval: number,
    lastWatered: string,
    imageUri: string
) => {
    try {
        db.runSync(
            `UPDATE plants SET name = ?, location = ?, wateringInterval = ?, lastWatered = ?, imageUri = ? WHERE id = ?;`,
            [name, location, wateringInterval, lastWatered, imageUri, id]
        );
    } catch (error) {
        console.error('Error updating plant:', error);
        throw error;
    }
};

// Delete plant
export const deletePlant = (id: number) => {
    try {
        db.runSync(`DELETE FROM plants WHERE id = ?;`, [id]);
    } catch (error) {
        console.error('Error deleting plant:', error);
        throw error;
    }
};
