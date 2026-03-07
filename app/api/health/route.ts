import { db } from "@/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json(
      {
        status: "ok",
        db: "ok",
        latency_ms: Date.now() - start,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[health] DB check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        db: "unreachable",
        latency_ms: Date.now() - start,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
