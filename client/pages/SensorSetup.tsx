import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SensorSetup(){
  const [sensors, setSensors] = useState<any>(null);

  useEffect(()=>{
    fetch('/api/sensors').then(r=>r.json()).then(d=>setSensors(d));
  },[]);

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sensor Setup</h1>
      </header>

      <section className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Sensors Overview</CardTitle>
            <CardDescription>View and test sensors in the field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-md">
                <p className="text-sm text-muted-foreground">Soil Moisture</p>
                <p className="font-bold">{sensors?.soilMoisture ?? '--'}%</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={()=>alert('Calibration started')}>Calibrate</Button>
                  <Button size="sm" variant="outline" onClick={()=>alert('Self-test started')}>Self-test</Button>
                </div>
              </div>

              <div className="p-3 border rounded-md">
                <p className="text-sm text-muted-foreground">Ambient</p>
                <p className="font-bold">{sensors?.temperatureC ?? '--'}°C • {sensors?.humidity ?? '--'}%</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" onClick={()=>alert('Firmware update flow')}>Update Firmware</Button>
                  <Button size="sm" variant="outline" onClick={()=>alert('Reconnect signal')}>Reconnect</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
