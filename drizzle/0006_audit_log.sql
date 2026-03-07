-- Add audit_log table for append-only event tracking
CREATE TABLE IF NOT EXISTS "audit_log" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text,
  "action" text NOT NULL,
  "metadata" text,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamp NOT NULL,
  CONSTRAINT "audit_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_log_user_id_idx" ON "audit_log" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");
