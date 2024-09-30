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
      <div className="bg-gray-50 w-full md:w-[90vw] mx-auto min-h-screen">
        <div className="p-2 sm:p-4 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* First Column */}
            <div className="flex flex-col space-y-4">
              <div className="flex-grow">
                <Suspense fallback={<div className="h-full flex items-center justify-center">Loading card data...</div>}>
                  <CardContainer />
                </Suspense>
              </div>
              <div className="flex-grow">
                <Suspense fallback={<div className="h-full flex items-center justify-center">Loading bill data...</div>}>
                  <BillChart />
                </Suspense>
              </div>
              <div className="flex-grow">
                <Suspense fallback={<div className="h-full flex items-center justify-center">Loading price action chart...</div>}>
                  <PriceActionChart />
                </Suspense>
              </div>
            </div>
            {/* Second Column */}
            <div className="flex flex-col space-y-4">
              <div className="flex-grow">
                <Suspense fallback={<div className="h-full flex items-center justify-center">Loading pie chart...</div>}>
                  <PieChartContainer />
                </Suspense>
              </div>
              <div className="flex-grow">
                <Suspense fallback={<div className="h-full flex items-center justify-center">Loading data table...</div>}>
                  <DataTableContainer />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BillDataProvider>
  );
}