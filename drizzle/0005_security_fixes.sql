-- Fix: change days_since_epoch from text to integer for correct numeric comparison
ALTER TABLE "ai_usage" ALTER COLUMN "days_since_epoch" SET DATA TYPE integer USING "days_since_epoch"::integer;--> statement-breakpoint

-- Fix: add index on subscription.userId for faster per-user subscription lookups
CREATE INDEX IF NOT EXISTS "subscription_user_id_idx" ON "subscription" USING btree ("userId");
