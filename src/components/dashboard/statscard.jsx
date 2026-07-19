import { TrendingUp } from "lucide-react";
import { Download } from "lucide-react";
import { Heart } from "lucide-react";
import { Images } from "lucide-react";
import React from "react";

export default function StatsCard({ stats }) {
  const items = [
    {
      label: "Total Galleries",
      value: stats.totalGalleries,
      sub: `${stats.publishedGalleries} published`,
      icon: Images,
    },
    {
      label: "Total Photos",
      value: stats.totalPhotos.toLocaleString("de-DE"),
      sub: "across all galleries",
      icon: TrendingUp,
    },
    {
      label: "Client Selections",
      value: stats.clientSelections,
      sub: "client submissions",
      icon: Heart,
    },
    {
      label: "Downloads Enabled",
      value: stats.downloadsEnabled,
      sub: "galleries with download",
      icon: Download,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(({ label, value, sub, icon: Icon }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-semibold text-foreground font-sans">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </div>
      ))}
    </div>
  );
}
