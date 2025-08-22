import { addPlant, getPlantById } from "../src/services/database";

// Mock SQLite, damit keine echte DB genutzt wird
jest.mock("expo-sqlite", () => ({
    openDatabaseSync: jest.fn(() => ({
        execSync: jest.fn(),
        runSync: jest.fn(),
        getAllSync: jest.fn((query: string, params: any[]) => {
            if (query.includes("WHERE id = ?") && params[0] === 1) {
                return [{
                    id: 1,
                    name: "Aloe Vera",
                    location: "Wohnzimmer",
                    wateringInterval: 3,
                    lastWatered: "2025-08-20",
                    imageUri: "test.png"
                }];
            }
            return [];
        }),
    })),
}));

describe("Database Service", () => {
    it("Positivtest: sollte eine Pflanze zurückgeben (ID = 1)", () => {
        const plant = getPlantById(1);
        expect(plant).not.toBeNull();
        expect(plant?.name).toBe("Aloe Vera");
    });

    it("Negativtest: sollte null zurückgeben, wenn keine Pflanze existiert", () => {
        const plant = getPlantById(999);
        expect(plant).toBeNull();
    });
});
