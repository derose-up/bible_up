import React from "react";
import { Check } from "lucide-react";

interface RibbonBadgeProps {
  text: string;
  type?: "diagonal" | "corner" | "straight";
  color?: "green" | "purple" | "blue" | "red" | "pink";
  icon?: boolean;
  animate?: boolean;
}

const RibbonBadgeComponent: React.FC<RibbonBadgeProps> = ({
  text,
  type = "diagonal",
  color = "pink",
  icon = false,
  animate = true,
}) => {
  const colorClasses: Record<string, string> = {
    green: "from-green-500 to-green-700",
    purple: "from-purple-500 to-purple-700",
    blue: "from-blue-500 to-blue-700",
    red: "from-red-500 to-red-700",
    pink: "from-pink-500 to-pink-700",
  };

  const baseColors = `bg-gradient-to-r ${colorClasses[color]} text-white`;
  const animationClass = animate ? "animate-pulse" : "";

  if (type === "diagonal") {
    return (
      <span
        className={`absolute top-4 -right-8 ${baseColors} w-44 h-8 flex items-center justify-center text-sm font-bold shadow-lg`}
        style={{ transform: "rotate(45deg)" }}
        aria-label={`Etiqueta ${text}`}
      >
        <span className="flex items-center gap-2">
          {icon && <Check size={16} />}
          {text}
        </span>
      </span>
    );
  }

  if (type === "corner") {
    return (
      <span
        className={`absolute top-0 right-0 ${baseColors} text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md flex items-center gap-1 ${animationClass}`}
        aria-label={`Etiqueta ${text}`}
      >
        {icon && <Check size={14} />}
        {text}
      </span>
    );
  }

  if (type === "straight") {
    return (
      <span
        className={`absolute top-2 right-2 ${baseColors} text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 ${animationClass}`}
        aria-label={`Etiqueta ${text}`}
      >
        {icon && <Check size={14} />}
        {text}
      </span>
    );
  }

  return null;
};

// ✅ Otimização com React.memo (comparação profunda de props relevantes)
const RibbonBadge = React.memo(RibbonBadgeComponent, (prev, next) => {
  return (
    prev.text === next.text &&
    prev.type === next.type &&
    prev.color === next.color &&
    prev.icon === next.icon &&
    prev.animate === next.animate
  );
});

export default RibbonBadge;
