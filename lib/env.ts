/**
 * Server-side environment variable validation.
 * Import this file in any server entry point so misconfiguration is caught at startup.
 * All variables listed here are required unless marked .optional().
 */
import { z } from "zod";

const serverEnvSchema = z.object({
  // App
  BASE_URL: z.string().url("BASE_URL must be a valid URL"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // AI
  GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required"),
  GROQ_API_KEY: z.string().optional(),
  GOOGLE_FONTS_API_KEY: z.string().optional(),

  // Polar (payments)
  POLAR_WEBHOOK_SECRET: z.string().min(1, "POLAR_WEBHOOK_SECRET is required"),
  POLAR_ACCESS_TOKEN: z.string().min(1, "POLAR_ACCESS_TOKEN is required"),

  // Subscription — server-only (never expose to client)
  TWEAKCN_PRO_PRODUCT_ID: z
    .string()
    .min(1, "TWEAKCN_PRO_PRODUCT_ID is required"),

  // Rate limiting (Vercel KV / Upstash) — optional in local dev without KV
  KV_REST_API_URL: z.string().url().optional().or(z.literal("")),
  KV_REST_API_TOKEN: z.string().optional(),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `Invalid or missing environment variables:\n${formatted}\n\nCheck your .env.local file.`
  );
}

export const env = parsed.data;
