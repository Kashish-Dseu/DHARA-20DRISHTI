import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Schedule() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sensors")
      .then((r) => r.json())
      .then((d) => setEvents(d.upcoming || []));
  }, []);

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
      </header>

      <section className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Irrigation Events</CardTitle>
            <CardDescription>Manage scheduled watering</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {events.map((ev: any) => (
                <li
                  key={ev.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{ev.zone}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ev.scheduledAt).toLocaleString()} •{" "}
                      {ev.durationMinutes} min
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        alert("Reschedule flow not implemented in demo");
                      }}
                    >
                      Reschedule
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
