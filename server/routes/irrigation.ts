import { RequestHandler } from "express";
import { OverrideRequest, OverrideResponse } from "@shared/api";
import { delayNextEvent, getNextEvent, setIrrigation } from "./sensors";

export const handleOverride: RequestHandler = (req, res) => {
  const body = req.body as OverrideRequest;
  let message = "";

  switch (body.action) {
    case "start":
      setIrrigation(true);
      message = `Irrigation started${body.zone ? ` for ${body.zone}` : ""}.`;
      break;
    case "stop":
      setIrrigation(false);
      message = "Irrigation stopped.";
      break;
    case "delay":
      if (!body.delayMinutes || body.delayMinutes <= 0) {
        return res.status(400).json({ error: "delayMinutes must be > 0" });
      }
      delayNextEvent(body.delayMinutes);
      message = `Next irrigation delayed by ${body.delayMinutes} minutes.`;
      break;
    default:
      return res.status(400).json({ error: "Invalid action" });
  }

  const response: OverrideResponse = {
    ok: true,
    irrigationStatus: (body.action === "start") ? "ON" : "OFF",
    message,
    nextEvent: getNextEvent(),
  };

  res.json(response);
};
