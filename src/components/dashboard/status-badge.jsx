import { Badge } from "../ui/badge";

const STATUS_STYLE = {
  PUBLISHED:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  DRAFT:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  ARCHIVED: "bg-muted text-muted-foreground border-border",
  EXPIRED:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
};

const STATUS_LABELS = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
  EXPIRED: "Expired",
};

export default function StatusBadge({ status }) {
  return (
    <>
      <Badge className={STATUS_STYLE[status] || STATUS_STYLE.DRAFT}>
        {STATUS_LABELS[status] || "Unknown"}
      </Badge>
    </>
  );
}
