'use client'

import React, { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useBillData } from '@/contexts/BillDataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042', '#FF6663'];

const chartConfig: ChartConfig = {
  users: { label: "Users" },
};

export function ProviderDistributionChart() {
  const { billData, isLoading, error } = useBillData();
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const processedData = useMemo(() => {
    if (!billData.length) return [];

    const providerCounts: Record<string, number> = {};
    billData.forEach(bill => {
      providerCounts[bill.provider_name] = (providerCounts[bill.provider_name] || 0) + 1;
    });

    return Object.entries(providerCounts)
      .map(([name, count], index) => ({
        name,
        value: count,
        fill: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [billData]);

  useEffect(() => {
    if (processedData.length > 0 && !activeProvider) {
      setActiveProvider(processedData[0].name);
    }
  }, [processedData, activeProvider]);

  const activeIndex = useMemo(() => {
    const index = processedData.findIndex(item => item.name === activeProvider);
    return index !== -1 ? index : 0;
  }, [activeProvider, processedData]);

  if (isLoading) return <div>Loading provider distribution...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!processedData.length) return <div>No provider distribution data available.</div>;

  const total = processedData.reduce((sum, item) => sum + item.value, 0);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-2">
        <CardTitle className="text-sm sm:text-base">Kullanıcı Dağılımı</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <div className="h-full">
          <ChartContainer id="provider-distribution-chart" config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={processedData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => {
                    if (processedData[index]) {
                      setActiveProvider(processedData[index].name);
                    }
                  }}
                >
                  {processedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                {/* Custom label */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x="50%"
                    y="48%"
                    className="fill-foreground text-lg sm:text-xl md:text-2xl font-bold"
                  >
                    {processedData[activeIndex]?.value || 0}
                  </tspan>
                  <tspan
                    x="50%"
                    dy="20"
                    className="fill-muted-foreground text-xs sm:text-sm"
                  >
                    Kullanıcı
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}