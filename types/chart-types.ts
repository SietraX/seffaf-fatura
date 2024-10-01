export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

export interface ChartTooltipContentProps extends TooltipProps {
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
}

// Remove the ActiveShapeProps interface if it's no longer used