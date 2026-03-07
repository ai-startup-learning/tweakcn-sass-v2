import { NextResponse } from "next/server";

import { db } from "@/db";
import { communityTheme, theme as themeTable } from "@/db/schema";
import { generateThemeRegistryItemFromStyles } from "@/utils/registry/themes";
import { registryItemSchema } from "shadcn/schema";
import { getBuiltInThemeStyles } from "@/utils/theme-preset-helper";
import { ThemeStyles } from "@/types/theme";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const themeId = id.replace(/\.json$/, "");

  try {
    let themeName: string;
    let themeStyles: ThemeStyles;

    // Built-in themes are always public
    const builtInTheme = getBuiltInThemeStyles(themeId);
    if (builtInTheme) {
      themeName = builtInTheme.name;
      themeStyles = builtInTheme.styles;
    } else {
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

      themeName = row.name;
      themeStyles = row.styles;
    }

    const generatedRegistryItem = generateThemeRegistryItemFromStyles(themeName, themeStyles);

    const parsedRegistryItem = registryItemSchema.safeParse(generatedRegistryItem);
    if (!parsedRegistryItem.success) {
      console.error(
        "Could not parse the registry item from the database:",
        parsedRegistryItem.error.format()
      );
      return new NextResponse("Unexpected registry item format.", {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(parsedRegistryItem.data), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error("Error fetching the theme registry item:", e);
    return new NextResponse("Failed to fetch the theme registry item.", {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
