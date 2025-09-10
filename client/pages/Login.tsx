import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // demo auth: store simple token
    localStorage.setItem("dhara_user", user || "farmer");
    nav("/");
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm">Username</label>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full rounded-md border px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-md border px-3 py-2 mt-1"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Sign in</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
