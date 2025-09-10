import React from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ControlPanel() {
  const qc = useQueryClient();
  const toggle = useMutation({
    mutationFn: async (action: "start" | "stop") => {
      const res = await fetch("/api/irrigation/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Override", description: data.message });
      qc.invalidateQueries({ queryKey: ["sensors"] });
    },
  });

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Control Panel</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Manual Pump Control</CardTitle>
            <CardDescription>Start or stop the main pump immediately.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button className="flex-1" onClick={() => toggle.mutate("start")}><Play className="mr-2" />Start Pump</Button>
            <Button variant="secondary" className="flex-1" onClick={() => toggle.mutate("stop")}><Pause className="mr-2" />Stop Pump</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone Overrides</CardTitle>
            <CardDescription>Trigger irrigation for individual zones.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <Button className="flex-1" onClick={() => fetch(`/api/irrigation/override`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start", zone: `Zone ${i + 1}` }) }).then(r => r.json()).then(d => { toast({ title: 'Zone', description: d.message }); qc.invalidateQueries({ queryKey: ['sensors'] }) })}>Start Zone {i + 1}</Button>
                  <Button variant="outline" onClick={() => fetch(`/api/irrigation/override`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "stop", zone: `Zone ${i + 1}` }) }).then(r => r.json()).then(d => { toast({ title: 'Zone', description: d.message }); qc.invalidateQueries({ queryKey: ['sensors'] }) })}>Stop</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-8 text-xs text-muted-foreground">Actions are proxied to the controller. Use manual controls only in emergencies.</footer>
    </div>
  );
}
