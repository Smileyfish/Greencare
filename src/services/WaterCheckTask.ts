import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import { getPlantsSync } from "../services/database";

const TASK_NAME = "WATER_CHECK_TASK";

TaskManager.defineTask(TASK_NAME, async () => {
    try {
        const plants = getPlantsSync();
        const today = new Date().toDateString();

        for (const plant of plants) {
            const lastWatered = new Date(plant.lastWatered);
            const next = new Date(lastWatered);
            next.setDate(lastWatered.getDate() + plant.wateringInterval);

            if (next.toDateString() === today) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "🌱 Erinnerung",
                        body: `${plant.name} sollte heute gegossen werden 💧`,
                    },
                    trigger: null,
                });
            }
        }

        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (err) {
        console.error("WaterCheckTask error:", err);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export async function registerWaterCheckTask() {
    return BackgroundFetch.registerTaskAsync(TASK_NAME, {
        minimumInterval: 60 * 60 * 24,
        stopOnTerminate: false,
        startOnBoot: true,
    });
}
