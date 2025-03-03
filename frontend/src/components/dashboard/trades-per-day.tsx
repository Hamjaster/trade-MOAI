"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { day: "Mon", trades: 120 },
  { day: "Tue", trades: 150 },
  { day: "Wed", trades: 180 },
  { day: "Thu", trades: 140 },
  { day: "Fri", trades: 160 },
];

export function TradesPerDay() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Trades Per Day</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Bar dataKey="trades" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
