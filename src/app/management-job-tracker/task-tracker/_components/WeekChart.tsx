import { PieChart, Pie, Cell } from "recharts";

interface WeekChartProps {
  percentage: number;
  fullSize?: boolean;
  size?: number; // Optional custom size (default depends on fullSize)
}

const WeekChart = ({ percentage, fullSize = false, size }: WeekChartProps) => {
  const chartSize = size ?? (fullSize ? 120 : 80);
  const innerRadius = fullSize ? chartSize * 0.35 : chartSize * 0.32;
  const outerRadius = fullSize ? chartSize * 0.50 : chartSize * 0.45;

  const data = [
    { name: "Completed", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  const COLORS = ["#BA8D77", "#ECB7A4"];

  return (
    <div
      className="mx-auto relative flex justify-center items-center"
      style={{ width: chartSize, height: chartSize }}
    >
      <PieChart width={chartSize} height={chartSize}>
        <Pie
          data={data}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div
        className="absolute top-1/2 left-1/2 font-semibold text-slate-700"
        style={{
          transform: "translate(-50%, -50%)",
          fontSize: fullSize ? "0.875rem" : "0.75rem",
        }}
      >
        {percentage}%
      </div>
    </div>
  );
};

export default WeekChart;
