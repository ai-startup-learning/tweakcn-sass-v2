"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DayStat {
  day: string;
  users: number;
  themes: number;
}

function shortDate(iso: string) {
  const [, month, day] = iso.split("-");
  return `${month}/${day}`;
}

export function GrowthChart({ data }: { data: DayStat[] }) {
  const chartData = data.map((d) => ({ ...d, label: shortDate(d.day) }));

  return (
    <div className="rounded-md border p-4">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            interval={4}
            className="text-muted-foreground"
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <Tooltip
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="users"
            name="New Users"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="themes"
            name="New Themes"
            stroke="hsl(var(--chart-2, 142 76% 36%))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
