/**
 * Mock data generation utilities for realistic agricultural irrigation data
 */

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRealisticSoilMoisture(): number {
  // Soil moisture typically ranges 20-80%, we want realistic variation
  const baseValue = 45 + generateRandomNumber(-15, 25);
  return Math.max(0, Math.min(100, baseValue));
}

export function generateRealisticTemperature(): number {
  // Agricultural zones typically 15-35°C
  const hour = new Date().getHours();
  const dayNightVariation = hour > 6 && hour < 18 ? 8 : -3; // Warmer during day
  return 20 + dayNightVariation + generateRandomNumber(-5, 8);
}

export function generateRealisticHumidity(): number {
  // Humidity typically 30-80%
  return Math.max(30, Math.min(80, 55 + generateRandomNumber(-15, 20)));
}

export function generateRealisticTankLevel(): number {
  // Tank level 40-95%
  return Math.max(40, Math.min(95, 70 + generateRandomNumber(-20, 25)));
}

export function generateMoistureTrend(days: number = 7): number[] {
  // Generate a realistic 7-day moisture trend
  const trend: number[] = [];
  let baseValue = 50;

  for (let i = 0; i < days; i++) {
    baseValue += generateRandomNumber(-8, 8);
    trend.push(Math.max(20, Math.min(80, baseValue)));
  }

  return trend;
}

export function generateWaterUsageData(): { label: string; liters: number }[] {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  return days.map((day, index) => ({
    label: day,
    liters: 60 + index * 15 + generateRandomNumber(-20, 40),
  }));
}

export function generateIrrigationSchedule(): Array<{
  id: string;
  zone: string;
  scheduledAt: string;
  durationMinutes: number;
  reason: string;
}> {
  const zones = ["Zone 1", "Zone 2", "Zone 3"];
  const reasons = [
    "Routine schedule",
    "Soil moisture low",
    "Evening cooling",
    "Crop growth stage",
    "Weather adjustment",
  ];

  const events = [];

  for (let i = 0; i < 5; i++) {
    const zoneIndex = i % zones.length;
    const scheduledTime = new Date(Date.now() + (i + 1) * 1000 * 60 * (4 + i));

    events.push({
      id: `evt-${i + 1}`,
      zone: zones[zoneIndex],
      scheduledAt: scheduledTime.toISOString(),
      durationMinutes: 20 + generateRandomNumber(0, 20),
      reason: reasons[Math.floor(Math.random() * reasons.length)],
    });
  }

  return events;
}

export function generateAlerts(): Array<{
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  createdAt: string;
}> {
  const alertMessages = [
    { msg: "Low battery level at sensor Zone 2", severity: "warning" as const },
    { msg: "Soil moisture is low in Zone 1", severity: "critical" as const },
    { msg: "Sensor Zone 3 reconnected successfully", severity: "info" as const },
    { msg: "Water tank level below 50%", severity: "warning" as const },
    { msg: "High temperature detected - irrigation triggered", severity: "info" as const },
    { msg: "Sensor calibration needed for Zone 1", severity: "warning" as const },
  ];

  const selected = alertMessages.slice(0, generateRandomNumber(2, 4));

  return selected.map((alert, idx) => ({
    id: `a${idx + 1}`,
    severity: alert.severity,
    message: alert.msg,
    createdAt: new Date(Date.now() - generateRandomNumber(5, 120) * 1000 * 60).toISOString(),
  }));
}

export function generateMonthlyReports(): Array<{
  month: string;
  waterSavedLiters: number;
  energySavedKwh: number;
  yieldBenefitPercent: number;
}> {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const currentMonth = now.getMonth();

  const reports = [];

  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const month = months[monthIndex];

    reports.push({
      month,
      waterSavedLiters: 300 + generateRandomNumber(100, 400),
      energySavedKwh: 20 + generateRandomNumber(10, 40),
      yieldBenefitPercent: 5 + generateRandomNumber(2, 8),
    });
  }

  return reports;
}
