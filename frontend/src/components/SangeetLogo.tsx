import { cn } from "../lib/utils";

interface SangeetLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const SangeetLogo = ({ size = "md", className }: SangeetLogoProps) => {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={cn(
      "font-bold text-white flex items-center gap-2",
      sizes[size],
      className
    )}>
      <span className="text-emerald-500">Sangeet</span>
      <span>Box</span>
    </div>
  );
};
