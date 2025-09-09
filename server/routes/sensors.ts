import { RequestHandler } from "express";
import { AlertItem, IrrigationEvent, SensorSnapshot } from "@shared/api";

let irrigationOn = false;
let lastIrrigation = new Date(Date.now() - 1000 * 60 * 60).toISOString();
let scheduledEvents: IrrigationEvent[] = Array.from({ length: 3 }).map((_, i) => {
  const dt = new Date(Date.now() + (i + 1) * 1000 * 60 * 60 * 6);
  return {
    id: `evt-${i + 1}`,
    zone: `Zone ${i + 1}`,
    scheduledAt: dt.toISOString(),
    durationMinutes: 20 + i * 5,
    reason: i === 0 ? "Routine schedule" : i === 1 ? "Soil moisture low" : "Evening cooling",
  };
});

const baseAlerts: AlertItem[] = [
  {
    id: "a1",
    severity: "warning",
    message: "Low battery level at sensor Z2",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "a2",
    severity: "critical",
    message: "Soil moisture is too dry in Zone 1",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: "a3",
    severity: "info",
    message: "Sensor Z3 reconnected",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

function seq(len: number, start = 30, amp = 20) {
  return Array.from({ length: len }).map((_, i) =>
    Math.round(start + amp * Math.sin((i / (len - 1)) * Math.PI * 1.5) + Math.random() * 4 - 2),
  );
}

export const getSensors: RequestHandler = (_req, res) => {
  const moisture = Math.min(100, Math.max(0, seq(1, 48, 0)[0]));
  const temperatureC = Math.round(22 + Math.random() * 8);
  const humidity = Math.round(45 + Math.random() * 25);
  const tankLevel = Math.max(0, Math.min(100, 70 + Math.round(Math.random() * 20 - 10)));

  const moistureTrend = seq(7, 42, 10);
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const waterUsage = days.map((d, i) => ({ label: d, liters: 80 + i * 40 + Math.round(Math.random() * 30) }));

  const snapshot: SensorSnapshot = {
    soilMoisture: moisture,
    temperatureC,
    humidity,
    tankLevel,
    irrigationStatus: irrigationOn ? "ON" : "OFF",
    lastIrrigation,
    moistureTrend,
    waterUsage,
    alerts: baseAlerts,
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
    idx === 0 ? { ...ev, scheduledAt: new Date(new Date(ev.scheduledAt).getTime() + minutes * 60000).toISOString() } : ev,
  );
}

export function getNextEvent(): IrrigationEvent | null {
  return scheduledEvents[0] ?? null;
}
