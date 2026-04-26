import { cn } from "@/components/ui/utils";

const variantStyles = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
};

export function Button({ variant = "default", className = "", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant] ?? variantStyles.default,
        className
      )}
      {...props}
    />
  );
}
