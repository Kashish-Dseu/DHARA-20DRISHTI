import { RequestHandler } from "express";
import { AlertItem, IrrigationEvent, SensorSnapshot } from "@shared/api";
import {
  generateRealisticSoilMoisture,
  generateRealisticTemperature,
  generateRealisticHumidity,
  generateRealisticTankLevel,
  generateMoistureTrend,
  generateWaterUsageData,
  generateIrrigationSchedule,
  generateAlerts,
} from "../utils/mock-data";

let irrigationOn = false;
let lastIrrigation = new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString();
let scheduledEvents: IrrigationEvent[] = generateIrrigationSchedule();

export const getSensors: RequestHandler = (_req, res) => {
  const soilMoisture = generateRealisticSoilMoisture();
  const temperatureC = generateRealisticTemperature();
  const humidity = generateRealisticHumidity();
  const tankLevel = generateRealisticTankLevel();
  const moistureTrend = generateMoistureTrend(7);
  const waterUsage = generateWaterUsageData();
  const alerts = generateAlerts();

  const snapshot: SensorSnapshot = {
    soilMoisture,
    temperatureC,
    humidity,
    tankLevel,
    irrigationStatus: irrigationOn ? "ON" : "OFF",
    lastIrrigation,
    moistureTrend,
    waterUsage,
    alerts,
    upcoming: scheduledEvents,
  };

  res.json(snapshot);
};

export function setIrrigation(state: boolean) {
  irrigationOn = state;
  if (state) {
    lastIrrigation = new Date().toISOString();
  }
}

export function delayNextEvent(minutes: number) {
  scheduledEvents = scheduledEvents.map((ev, idx) =>
    idx === 0
      ? {
          ...ev,
          scheduledAt: new Date(
            new Date(ev.scheduledAt).getTime() + minutes * 60000,
          ).toISOString(),
        }
      : ev,
  );
}

export function getNextEvent(): IrrigationEvent | null {
  return scheduledEvents[0] ?? null;
}
