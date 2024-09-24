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
      <div className="flex justify-center bg-gray-50 min-h-screen">
        <div className="w-full max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] p-2 sm:p-4 overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
            {/* First column */}
            <div className="flex flex-col space-y-4 order-1 md:order-1">
              <div className="h-auto md:h-[250px] lg:h-[17vh]">
                <Suspense fallback={<div>Loading card data...</div>}>
                  <CardContainer />
                </Suspense>
              </div>
              <div className="h-auto md:h-[350px] lg:h-[33vh]">
                <Suspense fallback={<div>Loading bill data...</div>}>
                  <BillChart />
                </Suspense>
              </div>
              <div className="h-auto md:h-[350px] lg:h-[34vh]">
                <Suspense fallback={<div>Loading price action chart...</div>}>
                  <PriceActionChart />
                </Suspense>
              </div>
            </div>

            {/* Second column */}
            <div className="flex flex-col space-y-4 order-2 md:order-2">
              <div className="h-auto md:h-[600px] sm:h-auto xs:h-auto lg:h-[30vh]">
                <Suspense fallback={<div>Loading pie chart...</div>}>
                  <PieChartContainer />
                </Suspense>
              </div>
              <div className="h-auto md:h-[500px] lg:h-[56vh] overflow-hidden">
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
