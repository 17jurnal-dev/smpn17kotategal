import { cn } from "@/components/ui/utils";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className = "", ...props }) {
  return <div className={cn("p-4", className)} {...props} />;
}
