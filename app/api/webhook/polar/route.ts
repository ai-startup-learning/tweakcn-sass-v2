import { db } from "@/db";
import { subscription, user } from "@/db/schema";
import { Webhooks } from "@polar-sh/nextjs";
import { eq } from "drizzle-orm";
import { writeAuditLog } from "@/lib/audit";
import {
  sendSubscriptionConfirmationEmail,
  sendSubscriptionCancelledEmail,
} from "@/lib/email";
import { after } from "next/server";

function safeParseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

if (!process.env.POLAR_WEBHOOK_SECRET) {
  throw new Error("POLAR_WEBHOOK_SECRET environment variable is required");
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  onPayload: async ({ data, type }) => {
    if (
      type === "subscription.created" ||
      type === "subscription.active" ||
      type === "subscription.canceled" ||
      type === "subscription.revoked" ||
      type === "subscription.uncanceled" ||
      type === "subscription.updated"
    ) {
      const userId = data.customer?.externalId as string | undefined;

      const subscriptionData = {
        id: data.id,
        createdAt: new Date(data.createdAt),
        modifiedAt: safeParseDate(data.modifiedAt),
        amount: data.amount,
        currency: data.currency,
        recurringInterval: data.recurringInterval,
        status: data.status,
        currentPeriodStart: safeParseDate(data.currentPeriodStart) || new Date(),
        currentPeriodEnd: safeParseDate(data.currentPeriodEnd) || new Date(),
        cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
        canceledAt: safeParseDate(data.canceledAt),
        startedAt: safeParseDate(data.startedAt) || new Date(),
        endsAt: safeParseDate(data.endsAt),
        endedAt: safeParseDate(data.endedAt),
        customerId: data.customerId,
        productId: data.productId,
        discountId: data.discountId || null,
        checkoutId: data.checkoutId || "",
        customerCancellationReason: data.customerCancellationReason || null,
        customerCancellationComment: data.customerCancellationComment || null,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        customFieldData: data.customFieldData ? JSON.stringify(data.customFieldData) : null,
        userId: userId ?? null,
      };

      // Re-throw so Polar retries delivery on DB failure
      await db
        .insert(subscription)
        .values(subscriptionData)
        .onConflictDoUpdate({
          target: subscription.id,
          set: {
            modifiedAt: subscriptionData.modifiedAt || new Date(),
            amount: subscriptionData.amount,
            currency: subscriptionData.currency,
            recurringInterval: subscriptionData.recurringInterval,
            status: subscriptionData.status,
            currentPeriodStart: subscriptionData.currentPeriodStart,
            currentPeriodEnd: subscriptionData.currentPeriodEnd,
            cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
            canceledAt: subscriptionData.canceledAt,
            startedAt: subscriptionData.startedAt,
            endsAt: subscriptionData.endsAt,
            endedAt: subscriptionData.endedAt,
            customerId: subscriptionData.customerId,
            productId: subscriptionData.productId,
            discountId: subscriptionData.discountId,
            checkoutId: subscriptionData.checkoutId,
            customerCancellationReason: subscriptionData.customerCancellationReason,
            customerCancellationComment: subscriptionData.customerCancellationComment,
            metadata: subscriptionData.metadata,
            customFieldData: subscriptionData.customFieldData,
            userId: subscriptionData.userId,
          },
        });

      if (userId) {
        const auditAction =
          type === "subscription.active" || type === "subscription.created"
            ? "subscription.activated"
            : type === "subscription.canceled"
              ? "subscription.cancelled"
              : type === "subscription.revoked"
                ? "subscription.revoked"
                : "subscription.updated";

        await writeAuditLog({
          userId,
          action: auditAction,
          metadata: { subscriptionId: data.id, status: data.status, type },
        });

        // Send transactional emails after the response is returned (non-blocking).
        // Uses Next.js after() so email failures never affect webhook delivery.
        // Idempotency key prevents duplicate sends on Polar webhook re-delivery.
        after(async () => {
          try {
            const [userData] = await db
              .select({ email: user.email, name: user.name })
              .from(user)
              .where(eq(user.id, userId));

            if (userData) {
              const idempotencyKey = `${data.id}-${type}`;
              if (type === "subscription.active") {
                await sendSubscriptionConfirmationEmail(userData.email, userData.name, idempotencyKey);
              } else if (type === "subscription.canceled") {
                await sendSubscriptionCancelledEmail(
                  userData.email,
                  userData.name,
                  subscriptionData.endsAt,
                  idempotencyKey,
                );
              }
            }
          } catch (e) {
            console.error("[webhook/polar] Failed to send subscription email:", e);
          }
        });
      }
    }
  },
});
