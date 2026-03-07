import { db } from "@/db";
import { oauthToken } from "@/db/schema";
import { authenticateClient, hashToken, oauthError } from "@/lib/oauth";
import { eq, or } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData().catch(() => null);
  if (!body) {
    return oauthError("invalid_request", "Request body must be form-encoded");
  }

  const token = body.get("token") as string | null;
  if (!token) {
    return oauthError("invalid_request", "Missing required parameter: token");
  }

  // RFC 7009 §2.1 — authenticate the client before revoking
  const clientId = body.get("client_id") as string | null;
  const clientSecret = body.get("client_secret") as string | null;

  if (!clientId || !clientSecret) {
    return oauthError(
      "invalid_client",
      "Missing required parameters: client_id, client_secret",
      401
    );
  }

  const app = await authenticateClient(clientId, clientSecret);
  if (!app) {
    return oauthError("invalid_client", "Invalid client credentials", 401);
  }

  const tokenHash = hashToken(token);

  // Try to match as access token or refresh token belonging to this client
  const [record] = await db
    .select({ id: oauthToken.id })
    .from(oauthToken)
    .where(
      or(
        eq(oauthToken.accessTokenHash, tokenHash),
        eq(oauthToken.refreshTokenHash, tokenHash)
      )
    )
    .limit(1);

  if (record) {
    await db
      .update(oauthToken)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(oauthToken.id, record.id));
  }

  // RFC 7009: always return 200 even if token not found
  return new Response(null, { status: 200 });
}
