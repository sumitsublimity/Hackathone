import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // ensures class merging
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomButtonProps {
  children?: ReactNode;
  text?: string;
  type?: "button" | "submit" | "reset";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  tooltip?: string;
  onClick?: () => void;
}

const Button = ({
  text,
  type = "button",
  variant = "default",
  disabled = false,
  className = "",
  icon,
  children,
  onClick,
  tooltip = "",
}: CustomButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ShadcnButton
          type={type}
          variant={variant}
          disabled={disabled}
          className={cn("flex items-center cursor-pointer", className)}
          onClick={onClick}
        >
          {icon && <span className="w-4 h-4">{icon}</span>}
          {text || children}
        </ShadcnButton>
      </TooltipTrigger>
      {tooltip && (
        <TooltipContent side="bottom" className="bg-lightSlateGreen">
          <p>{tooltip}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default Button;
