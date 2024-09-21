import { Suspense } from "react";
import BillChart from "@/components/bill-chart";
import { CardContainer } from "@/components/card-container";
import { BillDataProvider } from "@/contexts/BillDataContext";
import { DataTableContainer } from "@/components/data-table-container";
import { PriceActionChart } from "@/components/price-action-chart";
import { PieChartContainer } from "@/components/pie-chart-container";

export default function Dashboard() {
  return (
    <BillDataProvider>
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 auto-rows-auto">
          <div className="md:col-span-1 h-[200px] overflow-auto">
            <CardContainer />
          </div>
          <div className="md:col-span-1 h-[200px] overflow-auto">
            <PieChartContainer />
          </div>
          <div className="md:col-span-1 md:row-span-2">
            <Suspense fallback={<div>Loading bill chart...</div>}>
              <DataTableContainer />              
            </Suspense>
          </div>
          <div className="md:col-span-1">
            <Suspense fallback={<div>Loading bill data...</div>}>
              <BillChart />
            </Suspense>
          </div>
          <div className="md:col-span-1">
            <Suspense fallback={<div>Loading price action chart...</div>}>
              <PriceActionChart />
            </Suspense>
          </div>
        </div>
      </div>
    </BillDataProvider>
  );
}
