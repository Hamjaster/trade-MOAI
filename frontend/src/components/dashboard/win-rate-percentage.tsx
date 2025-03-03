"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { stage: "Qualified", rate: 80 },
  { stage: "Proposal", rate: 60 },
  { stage: "Negotiation", rate: 40 },
  { stage: "Contract", rate: 30 },
  { stage: "Win", rate: 20 },
];

export function WinRatePercentages() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Win Rate Percentages</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="stage" />
          <YAxis />
          <Bar dataKey="rate" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <span className="text-2xl font-bold">27%</span>
        <span className="text-gray-500 ml-2">Conversion</span>
      </div>
    </div>
  );
}
