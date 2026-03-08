import { adminGetAuditLog } from "@/actions/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function actionColor(action: string) {
  if (action.includes("delete") || action.includes("cancel")) return "destructive";
  if (action.includes("create") || action.includes("activate")) return "default";
  return "secondary";
}

export default async function AdminAuditPage() {
  const logs = await adminGetAuditLog(200);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">
          Last {logs.length} events, newest first
        </p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No audit log entries yet.
                </TableCell>
              </TableRow>
            )}
            {logs.map((log) => {
              let details: string | null = null;
              if (log.metadata) {
                try {
                  details = JSON.stringify(JSON.parse(log.metadata), null, 0);
                } catch {
                  details = log.metadata;
                }
              }
              return (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={actionColor(log.action)} className="text-xs font-mono">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.userName ? (
                      <div>
                        <div>{log.userName}</div>
                        <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">system</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.ipAddress ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {details ?? "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
