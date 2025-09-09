import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getSensors } from "./routes/sensors";
import { handleOverride } from "./routes/irrigation";
import { handleReports } from "./routes/reports";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Smart irrigation API
  app.get("/api/sensors", getSensors);
  app.post("/api/irrigation/override", handleOverride);
  app.get("/api/reports", handleReports);

  return app;
}
