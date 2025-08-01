import React, { JSX } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const RADIAN = Math.PI / 180;

interface StaffTurnoverGaugeProps {
  description: string;
}

interface ChartSegment {
  name: string;
  value: number;
  color: string;
}

interface NeedleProps {
  value: number;
  data: ChartSegment[];
  cx: number;
  cy: number;
  iR: number;
  oR: number;
  color: string;
}

const chartSegments: ChartSegment[] = [
  { name: "Low", value: 30, color: "#E8A68E" },
  { name: "Moderate", value: 40, color: "#ECB7A4" },
  { name: "High", value: 30, color: "#F1C6B6" },
];

const iR = 50;
const oR = 100;

const staff = 30;
const turnover = 300000;
const ratio = staff / turnover;
const scaledValue = Math.min(100, ratio * 1000000); // adjust as per scale

const drawNeedle = ({
  value,
  data,
  cx,
  cy,
  iR,
  oR,
  color,
}: NeedleProps): JSX.Element[] => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx;
  const y0 = cy;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle key="needle-base" cx={x0} cy={y0} r={r} fill={color} />,
    <path
      key="needle"
      d={`M${xba} ${yba} L${xbb} ${ybb} L${xp} ${yp} Z`}
      fill={color}
    />,
  ];
};

const StaffTurnoverGauge = (props: StaffTurnoverGaugeProps) => {
  const { description } = props;
  return (
    <div className="w-full max-w-md">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={chartSegments}
            cx="50%" // percent-based positioning
            cy="80%"
            innerRadius={iR}
            outerRadius={oR}
            stroke="none"
          >
            {chartSegments.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {/* Custom needle needs absolute pixel values for cx/cy */}
          {drawNeedle({
            value: scaledValue,
            data: chartSegments,
            cx: 150, // this must match the chart size (adjust if needed)
            cy: 200,
            iR,
            oR,
            color: "#333",
          })}
        </PieChart>
      </ResponsiveContainer>

      <p className="text-center text-sm mt-2">{description}</p>
    </div>
  );
};

export default StaffTurnoverGauge;
