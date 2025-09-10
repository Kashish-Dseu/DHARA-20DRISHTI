import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Register(){
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [farm, setFarm] = useState("");
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo registration: store basic profile
    const profile = { user: user || 'farmer', farm: farm || 'My Farm' };
    localStorage.setItem('dhara_profile', JSON.stringify(profile));
    localStorage.setItem('dhara_user', user || 'farmer');
    nav('/');
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm">Full name</label>
              <input value={user} onChange={(e)=>setUser(e.target.value)} className="w-full rounded-md border px-3 py-2 mt-1" placeholder="e.g., Ram Kumar" />
            </div>
            <div>
              <label className="text-sm">Farm name</label>
              <input value={farm} onChange={(e)=>setFarm(e.target.value)} className="w-full rounded-md border px-3 py-2 mt-1" placeholder="e.g., Green Acres" />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} className="w-full rounded-md border px-3 py-2 mt-1" />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Register</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
