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
      <div className="h-screen p-4 md:p-8 bg-gray-50 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* First column */}
          <div className="flex flex-col space-y-4 overflow-hidden h-full">
            <div className="h-[30vh]">
              <PieChartContainer />
            </div>
            <div className="h-[57vh] overflow-auto">
              <Suspense fallback={<div>Loading bill chart...</div>}>
                <DataTableContainer />
              </Suspense>
            </div>
          </div>

          {/* Second column */}
          <div className="flex flex-col space-y-4 overflow-hidden h-full">
            <div className="h-[15vh]">
              <CardContainer />
            </div>
            <div className="h-[35vh]">
              <Suspense fallback={<div>Loading bill data...</div>}>
                <BillChart />
              </Suspense>
            </div>
            <div className="h-[30vh]">
              <Suspense fallback={<div>Loading price action chart...</div>}>
                <PriceActionChart />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </BillDataProvider>
  );
}
