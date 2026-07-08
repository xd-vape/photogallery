import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-input text-primary accent-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
}
