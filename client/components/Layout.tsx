import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

function useSensors() {
  return useQuery({
    queryKey: ["sensors-global"],
    queryFn: async () => {
      const res = await fetch('/api/sensors');
      if(!res.ok) throw new Error('Failed');
      return res.json();
    },
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

export default function Layout() {
  const { data } = useSensors();
  const soil = data?.soilMoisture;

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
            <li>
              <NavLink to="/" end className={({ isActive }) => cn("rounded-md px-3 py-2 block", isActive ? "bg-primary/10 text-foreground" : "hover:bg-accent")}>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/control" className={({ isActive }) => cn("rounded-md px-3 py-2 block", isActive ? "bg-primary/10 text-foreground" : "hover:bg-accent")}>Control Panel</NavLink>
            </li>
            <li>
              <NavLink to="/insights" className={({ isActive }) => cn("rounded-md px-3 py-2 block", isActive ? "bg-primary/10 text-foreground" : "hover:bg-accent")}>Data Insights</NavLink>
            </li>
            <li>
              <NavLink to="/schedule" className={({ isActive }) => cn("rounded-md px-3 py-2 block", isActive ? "bg-primary/10 text-foreground" : "hover:bg-accent")}>Schedule</NavLink>
            </li>
            <li>
              <NavLink to="/sensors" className={({ isActive }) => cn("rounded-md px-3 py-2 block", isActive ? "bg-primary/10 text-foreground" : "hover:bg-accent")}>Sensor Setup</NavLink>
            </li>
            <li>
              <NavLink to="/login" className="rounded-md px-3 py-2 hover:bg-accent block">Login</NavLink>
            </li>
            <li>
              <NavLink to="/register" className="rounded-md px-3 py-2 hover:bg-accent block">Register</NavLink>
            </li>
          </ul>
        </nav>

        <div className="mt-auto text-sm">
          <div className="px-3 py-2 rounded-md bg-white/5">
            <p className="text-xs text-muted-foreground">Soil moisture</p>
            <p className="font-semibold text-lg">{typeof soil === 'number' ? `${soil}%` : '--'}</p>
          </div>
        </div>
      </aside>

      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
