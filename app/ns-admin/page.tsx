"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimeCard } from "@/components/ui/prime-card";
import { supabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/setup-status")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setHasAdmin(Boolean(data?.hasAdmin));
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasAdmin(true);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const isSetupMode = useMemo(() => hasAdmin === false, [hasAdmin]);

  const handleSetupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/admin/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setStatus("success");
      setMessage("Admin created. You can sign in now.");
      setHasAdmin(true);
      setUsername("");
      setPassword("");
      return;
    }

    const data = await response.json().catch(() => ({}));
    setStatus("error");
    setMessage(data?.message || "Setup failed.");
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const email = username.includes("@")
      ? username
      : `${username}@primeelec.local`;
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session?.access_token) {
      setStatus("error");
      setMessage(error?.message || "Invalid credentials.");
      return;
    }

    const sessionResponse = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: data.session.access_token }),
    });
    const sessionData = await sessionResponse.json().catch(() => ({}));

    if (!sessionResponse.ok) {
      setStatus("error");
      setMessage(sessionData?.message || "You do not have admin access.");
      return;
    }

    setStatus("success");
    router.push("/admin/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
        <Image
          src="/images/logo/prime-elec-logo-black.png"
          alt="Prime Elec"
          width={180}
          height={48}
          className="h-10 w-auto"
          priority
        />

        <PrimeCard className="w-full p-6">
          {hasAdmin === null ? (
            <>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Checking setup
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Verifying admin status...
              </p>
            </>
          ) : isSetupMode ? (
            <>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Create admin
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                No admin exists yet. Create the first admin account to continue.
              </p>

              <form className="mt-6 grid gap-4" onSubmit={handleSetupSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="setup-username">Username</Label>
                  <Input
                    id="setup-username"
                    type="text"
                    autoComplete="username"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="setup-password">Password</Label>
                  <Input
                    id="setup-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                {message ? (
                  <p
                    className={`text-xs ${
                      status === "error"
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {message}
                  </p>
                ) : null}
                <Button
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Creating..." : "Create admin"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your credentials to access your account.
              </p>

              <form className="mt-6 grid gap-4" onSubmit={handleSignIn}>
                <div className="grid gap-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    autoComplete="username"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                {message ? (
                  <p
                    className={`text-xs ${
                      status === "error"
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {message}
                  </p>
                ) : null}
                <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {status === "loading" ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </>
          )}
        </PrimeCard>
      </div>
    </main>
  );
}
