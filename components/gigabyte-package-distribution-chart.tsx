"use client"

import React, { useMemo, useState, useEffect } from 'react'
import { PieChart, Pie, Sector, ResponsiveContainer, Label } from 'recharts'
import { useBillData } from '@/contexts/BillDataContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042', '#FF6663'];

const chartConfig: ChartConfig = {
  visitors: { label: "Users" },
};

const GB_GROUPS = [
  { name: '0-10 GB', min: 0, max: 10 },
  { name: '10-25 GB', min: 10, max: 25 },
  { name: '25-50 GB', min: 25, max: 50 },
  { name: '50-100 GB', min: 50, max: 100 },
  { name: '100+ GB', min: 100, max: Infinity },
];

export function GigabytePackageDistributionChart() {
  const { billData, isLoading, error } = useBillData();
  const [activePackage, setActivePackage] = useState<string | null>(null);

  const processedData = useMemo(() => {
    if (!billData.length) return [];

    const groupCounts: Record<string, number> = {};
    GB_GROUPS.forEach(group => {
      groupCounts[group.name] = 0;
    });

    billData.forEach(bill => {
      const group = GB_GROUPS.find(g => bill.gigabyte_package >= g.min && bill.gigabyte_package <= g.max);
      if (group) {
        groupCounts[group.name]++;
      }
    });

    return Object.entries(groupCounts)
      .map(([name, count], index) => ({
        name,
        value: count,
        fill: COLORS[index % COLORS.length]
      }))
      .filter(item => item.value > 0);
  }, [billData]);

  useEffect(() => {
    if (processedData.length > 0 && !activePackage) {
      setActivePackage(processedData[0].name);
    }
  }, [processedData, activePackage]);

  const activeIndex = useMemo(() => {
    const index = processedData.findIndex(item => item.name === activePackage);
    return index !== -1 ? index : 0;
  }, [activePackage, processedData]);

  if (isLoading) return <div>Loading gigabyte package distribution...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!processedData.length) return <div>No gigabyte package distribution data available.</div>;

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
      <ChartStyle id="gigabyte-package-chart" config={chartConfig} />
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-sm sm:text-base">GB Tercihleri</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-full"> {/* Responsive height */}
          <ChartContainer id="gigabyte-package-chart" config={chartConfig} className="h-full w-full">
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
                      setActivePackage(processedData[index].name);
                    }
                  }}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const activeData = processedData[activeIndex] || processedData[0] || { value: 0, name: 'N/A' };
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 5}
                              className="fill-foreground text-lg sm:text-xl md:text-2xl font-bold"
                            >
                              {activeData.name.split(" ")[0]}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 15}
                              className="fill-muted-foreground text-xs sm:text-sm"
                            >
                              GB
                            </tspan>
                          </text>
                        )
                      }
                      return null;
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}