import { db } from "@/db";
import { auditLog } from "@/db/schema";

type AuditAction =
  | "account.deleted"
  | "account.created"
  | "subscription.activated"
  | "subscription.cancelled"
  | "subscription.updated"
  | "subscription.revoked"
  | "oauth.token_issued"
  | "oauth.token_revoked";

interface AuditOptions {
  userId?: string | null;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function writeAuditLog(opts: AuditOptions) {
  try {
    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      userId: opts.userId ?? null,
      action: opts.action,
      metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
      ipAddress: opts.ipAddress ?? null,
      userAgent: opts.userAgent ?? null,
      createdAt: new Date(),
    });
  } catch (error) {
    // Audit log failures must never crash the caller
    console.error("[audit] Failed to write audit log:", error);
  }
}
