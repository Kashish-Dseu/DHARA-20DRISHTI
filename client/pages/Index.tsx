import { useMemo, useState } from "react";
import {
  SensorSnapshot,
  ReportsResponse,
  OverrideResponse,
} from "@shared/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Droplets,
  Thermometer,
  Gauge,
  Bell,
  Play,
  Pause,
  Clock,
  LineChart as LineChartIcon,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { cn } from "@/lib/utils";

function useSensors() {
  return useQuery<SensorSnapshot>({
    queryKey: ["sensors"],
    queryFn: async () => {
      const res = await fetch("/api/sensors");
      if (!res.ok) throw new Error("Failed to load sensors");
      return res.json();
    },
    refetchInterval: 5000,
  });
}

function useReports() {
  return useQuery<ReportsResponse>({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to load reports");
      return res.json();
    },
    staleTime: 60_000,
  });
}

export default function Index() {
  const qc = useQueryClient();
  const { data: sensors } = useSensors();
  const { data: reports } = useReports();

  const overrideMutation = useMutation({
    mutationFn: async (body: { action: "start" | "stop" | "delay"; delayMinutes?: number }) => {
      const res = await fetch("/api/irrigation/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update irrigation");
      return (await res.json()) as OverrideResponse;
    },
    onSuccess: (resp) => {
      toast({ title: "Irrigation", description: resp.message });
      qc.invalidateQueries({ queryKey: ["sensors"] });
    },
  });

  const usage = sensors?.waterUsage ?? [];
  const trend = (sensors?.moistureTrend ?? []).map((v, i) => ({ label: `D${i + 1}`, value: v }));

  const totals = useMemo(() => reports?.totals, [reports]);

  return (
    <div className="min-h-screen bg-base grid grid-cols-[260px_1fr]">
      <aside className="hidden md:flex flex-col bg-sidebar p-5 gap-6 border-r">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <p className="font-extrabold tracking-tight text-xl leading-none">Dhara<span className="text-primary">Drishti</span></p>
            <p className="text-xs text-muted-foreground">Technology with roots in the soil.</p>
          </div>
        </div>
        <nav className="text-sm font-medium text-muted-foreground">
          <ul className="space-y-1">
            <li className="rounded-md px-3 py-2 bg-primary/10 text-foreground">Dashboard</li>
            <li className="rounded-md px-3 py-2 hover:bg-accent cursor-pointer">Control Panel</li>
            <li className="rounded-md px-3 py-2 hover:bg-accent cursor-pointer">Data Insights</li>
            <li className="rounded-md px-3 py-2 hover:bg-accent cursor-pointer">Schedule</li>
            <li className="rounded-md px-3 py-2 hover:bg-accent cursor-pointer">Sensor Setup</li>
            <li className="rounded-md px-3 py-2 hover:bg-accent cursor-pointer">Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="p-4 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className={cn("px-3 py-2 rounded-md border text-sm", sensors?.irrigationStatus === "ON" ? "border-green-300 bg-green-50 text-green-800" : "border-amber-300 bg-amber-50 text-amber-800")}>
              Status: {sensors?.irrigationStatus ?? "--"}
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <MetricCard title="Soil Moisture" value={`${sensors?.soilMoisture ?? "--"}%`} icon={<Droplets className="h-5 w-5" />} />
          <MetricCard title="Temperature" value={`${sensors?.temperatureC ?? "--"} °C`} icon={<Thermometer className="h-5 w-5" />} />
          <MetricCard title="Humidity" value={`${sensors?.humidity ?? "--"}%`} icon={<Gauge className="h-5 w-5" />} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
          <Card className="col-span-1">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Irrigation</CardTitle>
                <CardDescription>Last: {sensors?.lastIrrigation ? new Date(sensors.lastIrrigation).toLocaleString() : "--"}</CardDescription>
              </div>
              <BarChart3 className="text-primary" />
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button className="flex-1" onClick={() => overrideMutation.mutate({ action: "start" })}>
                <Play className="mr-2" /> Start
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => overrideMutation.mutate({ action: "stop" })}>
                <Pause className="mr-2" /> Stop
              </Button>
              <DelayDialog onDelay={(m) => overrideMutation.mutate({ action: "delay", delayMinutes: m })} />
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><LineChartIcon className="text-primary" /> Moisture Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="label" />
                  <YAxis domain={[0, 100]} />
                  <RTooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Water Usage</CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usage}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <RTooltip />
                  <Bar dataKey="liters" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Irrigation</CardTitle>
              <CardDescription>Automated schedule based on crop and weather</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {sensors?.upcoming.map((ev) => (
                  <li key={ev.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <p className="font-medium">{ev.zone}</p>
                      <p className="text-sm text-muted-foreground">{new Date(ev.scheduledAt).toLocaleString()} • {ev.durationMinutes} min</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{ev.reason}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Reports</CardTitle>
              <CardDescription>Water/energy savings and yield benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {reports?.monthly.map((m) => (
                  <div key={m.month} className="rounded-md border p-3">
                    <p className="text-sm font-medium">{m.month}</p>
                    <p className="text-xs text-muted-foreground mt-1">Water saved</p>
                    <p className="font-semibold">{m.waterSavedLiters} L</p>
                    <p className="text-xs text-muted-foreground mt-1">Energy saved</p>
                    <p className="font-semibold">{m.energySavedKwh} kWh</p>
                    <p className="text-xs text-muted-foreground mt-1">Yield benefit</p>
                    <p className="font-semibold">{m.yieldBenefitPercent}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Bell className="text-primary" /> Notifications</CardTitle>
              <CardDescription>Live system alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {sensors?.alerts.map((a) => (
                  <li key={a.id} className="py-3 flex items-start gap-3">
                    <span className={cn("mt-1 h-2.5 w-2.5 rounded-full", a.severity === "critical" ? "bg-red-500" : a.severity === "warning" ? "bg-amber-500" : "bg-blue-500")} />
                    <div>
                      <p className="text-sm">{a.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} DharaDrishti — Smart, renewable-first irrigation.
        </footer>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function DelayDialog({ onDelay }: { onDelay: (m: number) => void }) {
  const [mins, setMins] = useState(30);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <Clock className="mr-2" /> Delay
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delay next irrigation</DialogTitle>
          <DialogDescription>Choose how many minutes to postpone the next event.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={5}
            step={5}
            value={mins}
            onChange={(e) => setMins(parseInt(e.target.value || "0", 10))}
            className="w-28 rounded-md border px-3 py-2"
          />
          <span className="text-sm text-muted-foreground">minutes</span>
        </div>
        <DialogFooter>
          <Button onClick={() => onDelay(mins)}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
