import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SessionsList } from "./components/sessions-list";

export const metadata = {
  title: "Sessions | Settings",
  description: "Manage your active login sessions.",
};

export default async function SessionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/");

  const sessions = await auth.api.listSessions({ headers: await headers() });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Active Sessions</h2>
        <p className="text-muted-foreground text-sm">
          These are the devices currently signed into your account. Revoke any session you don&apos;t
          recognise.
        </p>
      </div>
      <SessionsList sessions={sessions} currentSessionToken={session.session.token} />
    </div>
  );
}
