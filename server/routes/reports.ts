import { RequestHandler } from "express";
import { ReportsResponse } from "@shared/api";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const handleReports: RequestHandler = (_req, res) => {
  const now = new Date();
  const monthly = Array.from({ length: 6 }).map((_, i) => {
    const idx = (now.getMonth() - (5 - i) + 12) % 12;
    const waterSavedLiters = 300 + Math.round(Math.random() * 150) + i * 40;
    const energySavedKwh = 25 + Math.round(Math.random() * 12) + i * 3;
    const yieldBenefitPercent = 4 + Math.round(Math.random() * 3) + i * 0.5;
    return { month: months[idx], waterSavedLiters, energySavedKwh, yieldBenefitPercent };
  });

  const totals = monthly.reduce(
    (acc, m) => {
      acc.waterSavedLiters += m.waterSavedLiters;
      acc.energySavedKwh += m.energySavedKwh;
      acc.yieldBenefitPercentAvg += m.yieldBenefitPercent;
      return acc;
    },
    { waterSavedLiters: 0, energySavedKwh: 0, yieldBenefitPercentAvg: 0 },
  );
  totals.yieldBenefitPercentAvg = parseFloat((totals.yieldBenefitPercentAvg / monthly.length).toFixed(1));

  const response: ReportsResponse = { monthly, totals };
  res.json(response);
};
