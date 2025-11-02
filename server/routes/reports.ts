import { RequestHandler } from "express";
import { ReportsResponse } from "@shared/api";
import { generateMonthlyReports } from "../utils/mock-data";

export const handleReports: RequestHandler = (_req, res) => {
  const monthly = generateMonthlyReports();

  const totals = monthly.reduce(
    (acc, m) => {
      acc.waterSavedLiters += m.waterSavedLiters;
      acc.energySavedKwh += m.energySavedKwh;
      acc.yieldBenefitPercentAvg += m.yieldBenefitPercent;
      return acc;
    },
    { waterSavedLiters: 0, energySavedKwh: 0, yieldBenefitPercentAvg: 0 },
  );
  totals.yieldBenefitPercentAvg = parseFloat(
    (totals.yieldBenefitPercentAvg / monthly.length).toFixed(1),
  );

  const response: ReportsResponse = { monthly, totals };
  res.json(response);
};
