import { adminGetDailyStats } from "@/actions/admin";
import { GrowthChart } from "./growth-chart";

export default async function AdminAnalyticsPage() {
  const data = await adminGetDailyStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Daily signups and theme creations — last 30 days</p>
      </div>
      <GrowthChart data={data} />
    </div>
  );
}
