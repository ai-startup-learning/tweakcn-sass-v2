import { adminGetStats } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, CreditCard, Palette, Users } from "lucide-react";

export default async function AdminPage() {
  const stats = await adminGetStats();

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Total Themes", value: stats.themes, icon: Palette },
    { label: "Community Themes", value: stats.communityThemes, icon: Globe },
    { label: "Active Subscriptions", value: stats.activeSubscriptions, icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">Platform metrics at a glance</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
