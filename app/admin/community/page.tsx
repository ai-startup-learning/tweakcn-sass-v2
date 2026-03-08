import { adminGetCommunityThemes } from "@/actions/admin";
import { UnpublishButton } from "./unpublish-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function AdminCommunityPage() {
  const themes = await adminGetCommunityThemes();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Community Themes</h1>
        <p className="text-sm text-muted-foreground">
          {themes.length} published theme{themes.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Theme</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {themes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No community themes yet.
                </TableCell>
              </TableRow>
            )}
            {themes.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {t.themeName}
                    <Link
                      href={`/themes/${t.themeId}`}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{t.authorName}</div>
                  <div className="text-xs text-muted-foreground">{t.authorEmail}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs font-normal">
                    {new Date(t.publishedAt).toLocaleDateString()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{t.likeCount}</TableCell>
                <TableCell className="text-right">
                  <UnpublishButton communityThemeId={t.id} themeName={t.themeName} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
