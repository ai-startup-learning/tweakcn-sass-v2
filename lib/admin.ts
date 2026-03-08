import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Returns the list of admin email addresses from ADMIN_EMAILS env var.
 * The value is a comma-separated string, e.g. "alice@example.com,bob@example.com"
 */
function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns the current session user if they are an admin, otherwise returns null.
 */
export async function getAdminUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) return null;
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) return null;
  if (!adminEmails.includes(session.user.email.toLowerCase())) return null;
  return session.user;
}

/**
 * Throws a 403 if the current user is not an admin. Use in server actions and API routes.
 */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Forbidden: admin access required");
  }
  return user;
}
