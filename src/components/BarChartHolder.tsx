import { Bar, BarChart, Cell, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { useState } from "react";

export const BarChartHolder = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartConfig = {
    desktop: {
      color: "var(--chart-blue)",
    },
  };

  const chartData = [
    {
      month: "Sun",
      desktop: 189,
      fill: "#D0D9D6",
      hover: "#6e8780",
    },
    { month: "Mon", desktop: 230, fill: "#D0D9D6", hover: "#6e8780" },
    { month: "Tue", desktop: 300, fill: "#D0D9D6", hover: "#6e8780" },
    { month: "Wed", desktop: 200, fill: "#D0D9D6", hover: "#6e8780" },
    { month: "Thur", desktop: 478, fill: "#D0D9D6", hover: "#6e8780" },
    { month: "Fri", desktop: 189, fill: "#D0D9D6", hover: "#6e8780" },
    { month: "Sat", desktop: 189, fill: "#D0D9D6", hover: "#6e8780" },
  ];

  return (
    <article className="p-4 bg-white shadow hover:shadow-md rounded-2xl">
      {/*++++++++++++++ Title ++++++++++++++  */}
      <h3 className="text-darkGreen font-bold">Job Track</h3>
      {/*++++++++++++++ Description ++++++++++++++  */}
      <p>% of tasks completed today</p>
      <ChartContainer config={chartConfig} className="">
        <BarChart accessibilityLayer data={chartData}>
          {/* <CartesianGrid vertical={false} /> */}
          <XAxis
            dataKey="month"
            fontWeight={800}
            fontSize={16}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="desktop" radius={12}>
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
      </ChartContainer>
    </article>
  );
};
