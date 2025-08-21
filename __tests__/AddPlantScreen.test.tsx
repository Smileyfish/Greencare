import React from "react";
import { render } from "@testing-library/react-native";
import AddPlantScreen from "../src/screens/AddPlantScreen";
import { NavigationContainer } from "@react-navigation/native";

// Mock AsyncStorage & Navigation
jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(),
}));

jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native");
    return {
        ...actualNav,
        useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn() }),
    };
});

describe("Snapshot: AddPlantScreen", () => {
    it("rendert korrekt", () => {
        const tree = render(
            <NavigationContainer>
                <AddPlantScreen />
            </NavigationContainer>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
