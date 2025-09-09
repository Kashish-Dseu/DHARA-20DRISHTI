/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Smart Irrigation shared contracts
export interface SensorSnapshot {
  soilMoisture: number; // percentage 0-100
  temperatureC: number; // Celsius
  humidity: number; // percentage 0-100
  tankLevel: number; // percentage 0-100
  irrigationStatus: "ON" | "OFF";
  lastIrrigation: string; // ISO string
  moistureTrend: number[]; // last 7 days or points
  waterUsage: { label: string; liters: number }[]; // recent usage per day
  alerts: AlertItem[];
  upcoming: IrrigationEvent[];
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  message: string;
  createdAt: string; // ISO
}

export interface IrrigationEvent {
  id: string;
  zone: string; // e.g., "Zone 1"
  scheduledAt: string; // ISO start time
  durationMinutes: number;
  reason: string;
}

export interface OverrideRequest {
  action: "start" | "stop" | "delay";
  zone?: string;
  delayMinutes?: number;
}

export interface OverrideResponse {
  ok: true;
  irrigationStatus: "ON" | "OFF";
  message: string;
  nextEvent?: IrrigationEvent | null;
}

export interface ReportsResponse {
  monthly: {
    month: string; // e.g., "Jan"
    waterSavedLiters: number;
    energySavedKwh: number;
    yieldBenefitPercent: number;
  }[];
  totals: {
    waterSavedLiters: number;
    energySavedKwh: number;
    yieldBenefitPercentAvg: number;
  };
}
