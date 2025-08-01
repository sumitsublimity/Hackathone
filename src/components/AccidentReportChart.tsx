import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { useState } from "react";

export const AccidentReportChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartConfig = {
    desktop: {
      color: "var(--chart-blue)",
    },
  };

  const chartData = [
    {
      month: "Signed",
      desktop: 45,
      fill: "#B3846C",
      hover: "#8a6450",
    },
    { month: "Type", desktop: 30, fill: "#EDB9A9", hover: "#d69e8c" },
    { month: "Location", desktop: 15, fill: "#E8A68E", hover: "#d69e8c" },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[270px] w-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            fontWeight={500}
            fontSize={8}
            tickLine={false}
            tickMargin={8}
            axisLine={false}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            fontSize={12}
            tickCount={4}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" radius={4}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoveredIndex === index ? entry.hover : entry.fill}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
