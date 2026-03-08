"use client";

import { adminUnpublishTheme } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface UnpublishButtonProps {
  communityThemeId: string;
  themeName: string;
}

export function UnpublishButton({ communityThemeId, themeName }: UnpublishButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUnpublish = () => {
    if (!confirm(`Unpublish "${themeName}"? This removes it from the community gallery.`)) return;
    startTransition(async () => {
      try {
        await adminUnpublishTheme(communityThemeId);
        toast({ title: `"${themeName}" unpublished` });
        router.refresh();
      } catch {
        toast({ title: "Failed to unpublish theme", variant: "destructive" });
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleUnpublish}
      disabled={isPending}
    >
      {isPending ? "Removing..." : "Unpublish"}
    </Button>
  );
}
