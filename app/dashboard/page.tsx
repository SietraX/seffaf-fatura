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
      <div className="h-[calc(100vh-6vh)] md:overflow-hidden bg-gray-50">
        <div className="h-full w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] mx-auto p-2 sm:p-4">
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 md:overflow-hidden">
            {/* First column */}
            <div className="flex flex-col space-y-4 md:h-full md:overflow-auto md:pr-2">
              <div className="h-auto md:h-1/4 min-h-[200px]">
                <Suspense fallback={<div>Loading card data...</div>}>
                  <CardContainer />
                </Suspense>
              </div>
              <div className="h-auto md:h-1/3 min-h-[250px]">
                <Suspense fallback={<div>Loading bill data...</div>}>
                  <BillChart />
                </Suspense>
              </div>
              <div className="h-auto md:h-5/12 min-h-[300px]">
                <Suspense fallback={<div>Loading price action chart...</div>}>
                  <PriceActionChart />
                </Suspense>
              </div>
            </div>

            {/* Second column */}
            <div className="flex flex-col space-y-4 md:h-full md:overflow-auto md:pl-2">
              <div className="h-auto md:h-1/2 min-h-[400px]">
                <Suspense fallback={<div>Loading pie chart...</div>}>
                  <PieChartContainer />
                </Suspense>
              </div>
              <div className="h-auto md:h-1/2 min-h-[400px]">
                <Suspense fallback={<div>Loading bill chart...</div>}>
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
