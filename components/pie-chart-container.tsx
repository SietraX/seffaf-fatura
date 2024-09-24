import { Suspense } from "react";
import { ProviderDistributionChart } from "@/components/provider-distribution-chart";
import { GigabytePackageDistributionChart } from "@/components/gigabyte-package-distribution-chart";
import { ContractStartMonthChart } from "@/components/contract_start_month_chart";

export function PieChartContainer() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
      <div className="col-span-1 md:col-span-1 md:row-span-1">
        <Suspense fallback={<div className="h-full">Loading provider distribution...</div>}>
          <ProviderDistributionChart />
        </Suspense>
      </div>
      <div className="col-span-1 md:col-span-1 md:row-span-1 md:col-start-3">
        <Suspense fallback={<div className="h-full">Loading gigabyte package distribution...</div>}>
          <GigabytePackageDistributionChart />
        </Suspense>
      </div>
      <div className="col-span-2 md:col-span-1 md:row-start-1 md:col-start-2">
        <Suspense fallback={<div className="h-full">Loading contract start month distribution...</div>}>
          <ContractStartMonthChart />
        </Suspense>
      </div>
    </div>
  );
}
