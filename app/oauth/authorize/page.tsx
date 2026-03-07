"use client";

import Github from "@/assets/github.svg";
import Google from "@/assets/google.svg";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SCOPE_LABELS: Record<string, string> = {
  "themes:read": "Read your saved themes",
  "profile:read": "Read your profile (name, email)",
};

export default function OAuthAuthorizePage() {
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [authorizing, setAuthorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appName, setAppName] = useState<string | null>(null);

  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const scopes =
    searchParams
      .get("scope")
      ?.split(/[\s,]+/)
      .filter(Boolean) ?? [];

  useEffect(() => {
    if (!clientId) {
      setError("Missing client_id parameter");
      return;
    }

    fetch(`/api/oauth/app-info?client_id=${encodeURIComponent(clientId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error_description ?? "Invalid application");
        } else {
          setAppName(data.name);
        }
      })
      .catch(() => setError("Failed to validate application"));
  }, [clientId]);

  const handleAllow = () => {
    setAuthorizing(true);
    window.location.href = `/api/oauth/authorize?${searchParams.toString()}`;
  };

  const handleDeny = () => {
    if (!redirectUri) return;
    const url = new URL(redirectUri);
    url.searchParams.set("error", "access_denied");
    url.searchParams.set("error_description", "User denied access");
    if (state) url.searchParams.set("state", state);
    window.location.href = url.toString();
  };

  const callbackURL = `/oauth/authorize?${searchParams.toString()}`;

  const handleSignIn = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL });
    } catch {
      setLoadingProvider(null);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (isPending || !appName) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not signed in — show social login buttons
  if (!session) {
    const isLoading = loadingProvider !== null;
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-sm text-muted-foreground">Sign in to authorize</p>
            <h1 className="mt-1 text-lg font-semibold text-foreground">{appName}</h1>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => handleSignIn("google")}
              className="h-10 w-full justify-center gap-2"
              disabled={isLoading}
            >
              <Google className="h-4 w-4" />
              Continue with Google
              {loadingProvider === "google" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleSignIn("github")}
              className="h-10 w-full justify-center gap-2"
              disabled={isLoading}
            >
              <Github className="h-4 w-4" />
              Continue with GitHub
              {loadingProvider === "github" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            </Button>
          </div>

          {scopes.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Permissions requested
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {scopes.map((scope) => (
                  <li key={scope}>{SCOPE_LABELS[scope] ?? scope}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Signed in — show explicit consent screen
  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <ShieldCheck className="mb-3 h-8 w-8 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{appName}</span> is requesting
            access to your account
          </p>
        </div>

        {scopes.length > 0 && (
          <div className="mb-6 rounded-md border bg-muted/40 px-4 py-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              This app will be able to
            </p>
            <ul className="space-y-1.5 text-sm text-foreground">
              {scopes.map((scope) => (
                <li key={scope} className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">•</span>
                  {SCOPE_LABELS[scope] ?? scope}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <Button className="w-full" onClick={handleAllow} disabled={authorizing}>
            {authorizing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Allow access"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleDeny} disabled={authorizing}>
            Deny
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground/60">
          Signed in as {session.user.email}
        </p>
      </div>
    </div>
  );
}
