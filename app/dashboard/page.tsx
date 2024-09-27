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
      <div className="bg-gray-50 w-full md:w-[90vw] mx-auto">
        <div className="relative p-2 sm:p-4">
          <div className="flex flex-col md:flex-row h-full gap-4">
            {/* First Column */}
            <div className="flex flex-col w-full md:w-1/2 space-y-4 w-">
              <div className="flex-1 md:flex-none min-h-fit">
                <Suspense fallback={<div>Loading card data...</div>}>
                  <CardContainer />
                </Suspense>
              </div>
              <div className="flex-1 md:flex-none min-h-fit h-[40vh]">
                <Suspense fallback={<div>Loading bill data...</div>}>
                  <BillChart />
                </Suspense>
              </div>
              <div className="flex-1 md:flex-none min-h-fit">
                <Suspense fallback={<div>Loading price action chart...</div>}>
                  <PriceActionChart />
                </Suspense>
              </div>
            </div>
            {/* Second Column */}
            <div className="flex flex-col w-full md:w-1/2 space-y-4">
              <div className="flex-1 md:flex-none min-h-fit">
                <Suspense fallback={<div>Loading pie chart...</div>}>
                  <PieChartContainer />
                </Suspense>
              </div>
              <div className="flex-1 md:flex-none md:h-[60%]">
                <Suspense fallback={<div>Loading data table...</div>}>
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
