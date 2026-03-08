import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { CommunityThemeCard, CommunityThemeCardSkeleton } from "./community-theme-card";
import { getCommunityThemes } from "@/actions/community-themes";
import type { CommunityThemesResponse } from "@/types/community";
import Link from "next/link";

export async function CommunityThemes() {
  const themesPromise = getCommunityThemes("popular", undefined, 6);

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">From the Community</h2>
          <Button variant="link" asChild className="h-fit gap-1 p-0 [&>svg]:size-3">
            <Link href="/community">
              View All <ChevronRight />
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Explore the themes the community is creating with {siteConfig.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense
          fallback={
            <>
              <CommunityThemeCardSkeleton />
              <CommunityThemeCardSkeleton />
              <CommunityThemeCardSkeleton />
            </>
          }
        >
          <CommunityThemeCards themesPromise={themesPromise} />
        </Suspense>
      </div>
    </>
  );
}

interface CommunityThemeCardsProps {
  themesPromise: Promise<CommunityThemesResponse>;
}

export async function CommunityThemeCards({ themesPromise }: CommunityThemeCardsProps) {
  const { themes } = await themesPromise;

  if (themes.length === 0) {
    return (
      <p className="text-muted-foreground col-span-full text-center text-sm">
        No community themes yet. Be the first to publish one!
      </p>
    );
  }

  return (
    <>
      {themes.map((theme) => (
        <CommunityThemeCard key={theme.id} theme={theme} />
      ))}
    </>
  );
}
