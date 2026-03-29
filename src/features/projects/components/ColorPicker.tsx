import type { ProjectColor } from "@/constants";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PROJECT_COLOR_LABELS,
  PROJECT_COLOR_VALUES,
  PROJECT_COLORS,
} from "@/constants";
import { cn } from "@/lib/utils";

type ColorPickerProps = {
  value: ProjectColor;
  onChange: (color: ProjectColor) => void;
};

const COLORS = Object.values(PROJECT_COLORS);

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {COLORS.map(color => (
        <Tooltip key={color}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className={cn(
                "rounded-full",
                value === color && "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )}
              onClick={() => onChange(color)}
            >
              <span
                className="size-4 rounded-full"
                style={{ backgroundColor: PROJECT_COLOR_VALUES[color] }}
              />
              <span className="sr-only">{PROJECT_COLOR_LABELS[color]}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {PROJECT_COLOR_LABELS[color]}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
