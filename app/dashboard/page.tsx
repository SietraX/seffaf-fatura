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
      <div className="flex justify-center bg-gray-50">
        <div className="w-full max-w-[80%] p-4 md:p-4 overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow">
            {/* First column */}
            <div className="flex flex-col space-y-4 order-2 lg:order-1">
              <div className="h-[300px] md:h-[400px] lg:h-[30vh]">
                <PieChartContainer />
              </div>
              <div className="h-[400px] md:h-[500px] lg:h-[56vh] overflow-hidden">
                <Suspense fallback={<div>Loading bill chart...</div>}>
                  <DataTableContainer />
                </Suspense>
              </div>
            </div>

            {/* Second column */}
            <div className="flex flex-col space-y-4 order-1 lg:order-2">
              <div className="h-[200px] md:h-[250px] lg:h-[17vh]">
                <CardContainer />
              </div>
              <div className="h-[300px] md:h-[350px] lg:h-[33vh]">
                <Suspense fallback={<div>Loading bill data...</div>}>
                  <BillChart />
                </Suspense>
              </div>
              <div className="h-[300px] md:h-[350px] lg:h-[34vh]">
                <Suspense fallback={<div>Loading price action chart...</div>}>
                  <PriceActionChart />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BillDataProvider>
  );
}
