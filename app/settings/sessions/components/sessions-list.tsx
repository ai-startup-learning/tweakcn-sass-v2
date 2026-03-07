"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Monitor, Smartphone, Globe } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Session {
  id: string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  expiresAt: Date;
}

function getDeviceIcon(userAgent?: string | null) {
  if (!userAgent) return Globe;
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return Smartphone;
  return Monitor;
}

function parseDevice(userAgent?: string | null) {
  if (!userAgent) return "Unknown device";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  return "Browser";
}

interface SessionsListProps {
  sessions: Session[];
  currentSessionToken: string;
}

export function SessionsList({ sessions, currentSessionToken }: SessionsListProps) {
  const [revoking, setRevoking] = useState<string | null>(null);
  const router = useRouter();

  async function revokeSession(token: string) {
    setRevoking(token);
    try {
      await authClient.revokeSession({ token });
      router.refresh();
    } finally {
      setRevoking(null);
    }
  }

  async function revokeOtherSessions() {
    setRevoking("all");
    try {
      await authClient.revokeOtherSessions();
      router.refresh();
    } finally {
      setRevoking(null);
    }
  }

  return (
    <div className="space-y-4">
      {sessions.length > 1 && (
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={revokeOtherSessions}
            disabled={revoking === "all"}
          >
            {revoking === "all" ? "Revoking…" : "Revoke all other sessions"}
          </Button>
        </div>
      )}
      {sessions.map((s) => {
        const isCurrent = s.token === currentSessionToken;
        const Icon = getDeviceIcon(s.userAgent);
        return (
          <Card key={s.id} className={isCurrent ? "border-primary" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon className="text-muted-foreground size-5 shrink-0" />
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {parseDevice(s.userAgent)}
                      {isCurrent && (
                        <span className="bg-primary/10 text-primary ml-2 rounded px-1.5 py-0.5 text-xs font-normal">
                          Current
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {s.ipAddress ?? "Unknown IP"} · Signed in{" "}
                      {new Date(s.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                {!isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeSession(s.token)}
                    disabled={revoking === s.token}
                  >
                    {revoking === s.token ? "Revoking…" : "Revoke"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-muted-foreground truncate text-xs">
                Expires {new Date(s.expiresAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
