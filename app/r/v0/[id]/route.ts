import { NextResponse } from "next/server";
import { db } from "@/db";
import { communityTheme, theme as themeTable } from "@/db/schema";
import { generateV0RegistryPayload } from "@/utils/registry/v0";
import { getBuiltInThemeStyles } from "@/utils/theme-preset-helper";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const themeId = id.replace(/\.json$/, "");

  try {
    // Built-in themes are always public
    const builtInTheme = getBuiltInThemeStyles(themeId);
    if (builtInTheme) {
      const payload = generateV0RegistryPayload(builtInTheme.name, builtInTheme.styles);
      return new NextResponse(JSON.stringify(payload), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Only serve user themes that have been published to the community.
    // Private themes must not be exposed via the public registry URL.
    const [row] = await db
      .select({
        name: themeTable.name,
        styles: themeTable.styles,
      })
      .from(communityTheme)
      .innerJoin(themeTable, eq(communityTheme.themeId, themeTable.id))
      .where(eq(communityTheme.themeId, themeId))
      .limit(1);

    if (!row) {
      return new NextResponse("Theme not found", {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = generateV0RegistryPayload(row.name, row.styles);
    return new NextResponse(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating v0 registry payload:", error);
    return new NextResponse("Failed to generate v0 payload", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
