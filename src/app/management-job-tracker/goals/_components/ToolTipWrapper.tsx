import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ToolTipWrapper = ({
  children,
  toolTipText,
}: {
  children: React.ReactNode;
  toolTipText: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="bg-lightSlateGreen">
        {toolTipText}
      </TooltipContent>
    </Tooltip>
  );
};
