import React from "react";
import { useQuery } from "@tanstack/react-query";
import { handleReports } from "@/../server/routes/reports"; // not used, but keep typesafe import avoidance
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip as RTooltip } from "recharts";

function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await fetch('/api/reports');
      if(!res.ok) throw new Error('Failed');
      return res.json();
    }
  });
}

export default function DataInsights(){
  const { data } = useReports();
  const monthly = data?.monthly ?? [];

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Data Insights</h1>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Water Savings Trend</CardTitle>
            <CardDescription>Monthly water saved (liters)</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis />
                <RTooltip />
                <Line type="monotone" dataKey="waterSavedLiters" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Savings</CardTitle>
            <CardDescription>Monthly energy saved (kWh)</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="month" />
                <YAxis />
                <RTooltip />
                <Line type="monotone" dataKey="energySavedKwh" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Aggregated savings and estimated yield benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 border rounded-md">
                <p className="text-sm text-muted-foreground">Total Water Saved</p>
                <p className="font-bold">{data?.totals?.waterSavedLiters ?? 0} L</p>
              </div>
              <div className="p-3 border rounded-md">
                <p className="text-sm text-muted-foreground">Total Energy Saved</p>
                <p className="font-bold">{data?.totals?.energySavedKwh ?? 0} kWh</p>
              </div>
              <div className="p-3 border rounded-md">
                <p className="text-sm text-muted-foreground">Avg Yield Benefit</p>
                <p className="font-bold">{data?.totals?.yieldBenefitPercentAvg ?? 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
