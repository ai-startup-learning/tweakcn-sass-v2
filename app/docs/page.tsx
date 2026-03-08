import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";

// ─── Helper components ─────────────────────────────────────────────────────────

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4 scroll-mt-20">
      {children}
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold border-b pb-2">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold">{children}</h3>;
}

function Endpoint({
  method,
  path,
  scope,
  description,
  responseExample,
}: {
  method: "GET" | "POST" | "DELETE";
  path: string;
  scope: string;
  description: string;
  responseExample?: string;
}) {
  const colors: Record<string, string> = {
    GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded px-2 py-0.5 text-xs font-bold font-mono ${colors[method]}`}>
          {method}
        </span>
        <code className="text-sm font-mono">{path}</code>
        <Badge variant="outline" className="text-xs">
          scope: {scope}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {responseExample && (
        <pre className="rounded bg-muted p-3 text-xs overflow-x-auto">
          <code>{responseExample}</code>
        </pre>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const baseUrl = siteConfig.url;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-12 space-y-12">
        <div>
          <h1 className="text-3xl font-bold">{siteConfig.name} API</h1>
          <p className="mt-2 text-muted-foreground">
            Use the REST API to access your themes and profile from external applications.
            All requests require a Bearer token obtained via OAuth 2.0.
          </p>
        </div>

        {/* Authentication */}
        <Section id="authentication">
          <H2>Authentication</H2>
          <p className="text-sm text-muted-foreground">
            All API endpoints require an <code className="text-xs bg-muted px-1 py-0.5 rounded">Authorization: Bearer &lt;access_token&gt;</code> header.
            Tokens are obtained through the standard OAuth 2.0 authorization code flow with PKCE.
          </p>

          <div className="space-y-3">
            <H3>OAuth 2.0 Endpoints</H3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2 items-baseline">
                <Badge variant="outline" className="shrink-0 text-xs font-mono">GET</Badge>
                <div>
                  <code className="text-xs">{baseUrl}/api/oauth/authorize</code>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Authorization endpoint. Params: <code className="text-xs">client_id</code>, <code className="text-xs">redirect_uri</code>, <code className="text-xs">response_type=code</code>, <code className="text-xs">scope</code>, <code className="text-xs">code_challenge</code>, <code className="text-xs">code_challenge_method=S256</code>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-baseline">
                <Badge variant="outline" className="shrink-0 text-xs font-mono">POST</Badge>
                <div>
                  <code className="text-xs">{baseUrl}/api/oauth/token</code>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Token endpoint. Body: <code className="text-xs">grant_type=authorization_code</code>, <code className="text-xs">code</code>, <code className="text-xs">redirect_uri</code>, <code className="text-xs">client_id</code>, <code className="text-xs">code_verifier</code>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-baseline">
                <Badge variant="outline" className="shrink-0 text-xs font-mono">POST</Badge>
                <div>
                  <code className="text-xs">{baseUrl}/api/oauth/revoke</code>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Revoke an access or refresh token.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <H3>Available Scopes</H3>
            <div className="flex flex-wrap gap-2">
              {["profile:read", "themes:read"].map((s) => (
                <Badge key={s} variant="secondary" className="font-mono text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </Section>

        {/* v1 API Endpoints */}
        <Section id="v1">
          <H2>REST API — v1</H2>
          <p className="text-sm text-muted-foreground">
            Base URL: <code className="text-xs bg-muted px-1 py-0.5 rounded">{baseUrl}/api/v1</code>
          </p>

          <div className="space-y-4">
            <Endpoint
              method="GET"
              path="/api/v1/me"
              scope="profile:read"
              description="Returns the authenticated user's profile."
              responseExample={`{
  "data": {
    "id": "user_abc123",
    "name": "Alice",
    "email": "alice@example.com",
    "image": "https://..."
  }
}`}
            />
            <Endpoint
              method="GET"
              path="/api/v1/themes"
              scope="themes:read"
              description="Returns all themes belonging to the authenticated user."
              responseExample={`{
  "data": [
    {
      "id": "theme_abc123",
      "name": "My Theme",
      "styles": { "light": { ... }, "dark": { ... } },
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}`}
            />
            <Endpoint
              method="GET"
              path="/api/v1/themes/:themeId"
              scope="themes:read"
              description="Returns a single theme by ID. Returns 404 if the theme doesn't exist or doesn't belong to the authenticated user."
              responseExample={`{
  "data": {
    "id": "theme_abc123",
    "name": "My Theme",
    "styles": { "light": { ... }, "dark": { ... } },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}`}
            />
          </div>
        </Section>

        {/* Error format */}
        <Section id="errors">
          <H2>Error Responses</H2>
          <p className="text-sm text-muted-foreground">
            Errors follow the OAuth 2.0 error format.
          </p>
          <pre className="rounded bg-muted p-3 text-xs overflow-x-auto">
            <code>{`{
  "error": "invalid_token",
  "error_description": "Token has expired or been revoked"
}`}</code>
          </pre>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><code className="text-xs">401</code> — Missing or invalid token</p>
            <p><code className="text-xs">403</code> — Token lacks required scope</p>
            <p><code className="text-xs">404</code> — Resource not found</p>
            <p><code className="text-xs">429</code> — Rate limit exceeded</p>
          </div>
        </Section>

        {/* Register an app */}
        <Section id="register">
          <H2>Registering an OAuth App</H2>
          <p className="text-sm text-muted-foreground">
            OAuth apps are created by an administrator using the CLI script:
          </p>
          <pre className="rounded bg-muted p-3 text-xs overflow-x-auto">
            <code>{`npx tsx scripts/create-oauth-app.ts \\
  --name "My App" \\
  --redirect-uris "https://myapp.com/callback" \\
  --scopes "themes:read,profile:read"`}</code>
          </pre>
          <p className="text-sm text-muted-foreground">
            Save the printed <strong>Client Secret</strong> — it cannot be retrieved again.
          </p>
        </Section>
      </main>
    </div>
  );
}
