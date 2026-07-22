import { Download, Heart, Images, TrendingUp } from "lucide-react";

function formatCount(value) {
  return Number(value ?? 0).toLocaleString("de-DE");
}

export default function StatsCard({ stats }) {
  const items = [
    {
      label: "Current Galleries",
      value: formatCount(stats.currentGalleries),
      sub: `${formatCount(
        stats.activePublishedGalleries,
      )} published · ${formatCount(stats.expiredGalleries)} expired`,
      icon: Images,
    },
    {
      label: "Total Photos",
      value: formatCount(stats.totalPhotos),
      sub: "in non-archived galleries",
      icon: TrendingUp,
    },
    {
      label: "Client Selections",
      value: formatCount(stats.clientSelections),
      sub: "client submissions",
      icon: Heart,
    },
    {
      label: "Downloads Enabled",
      value: formatCount(stats.downloadsEnabled),
      sub: "active published galleries",
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
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <p className="mt-3 font-sans text-2xl font-semibold text-foreground">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </div>
      ))}
    </div>
  );
}
