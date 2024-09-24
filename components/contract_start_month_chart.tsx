"use client"

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { CardContainer } from "@/components/card-container";

const data = [
  { month: "Jan", contracts: 30 },
  { month: "Feb", contracts: 20 },
  { month: "Mar", contracts: 50 },
  { month: "Apr", contracts: 40 },
  { month: "May", contracts: 60 },
  { month: "Jun", contracts: 70 },
  { month: "Jul", contracts: 80 },
  { month: "Aug", contracts: 90 },
  { month: "Sep", contracts: 100 },
  { month: "Oct", contracts: 110 },
  { month: "Nov", contracts: 120 },
  { month: "Dec", contracts: 130 },
];

export function ContractStartMonthChart() {
  return (
    <CardContainer title="Contract Start Month">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Bar dataKey="contracts" fill="hsl(var(--chart-1))" />
        </BarChart>
      </ResponsiveContainer>
    </CardContainer>
  );
}
