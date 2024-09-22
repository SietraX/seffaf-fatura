import { Suspense } from "react";
import { ProviderDistributionChart } from "@/components/provider-distribution-chart";
import { GigabytePackageDistributionChart } from "@/components/gigabyte-package-distribution-chart";
import { ContractStartMonthChart } from "@/components/contract_start_month_chart";

export function PieChartContainer() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
      <Suspense
        fallback={
          <div className="h-full">Loading provider distribution...</div>
        }
      >
        <ProviderDistributionChart />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-full">
            Loading contract start month distribution...
          </div>
        }
      >
        <ContractStartMonthChart />
      </Suspense>
      <Suspense
        fallback={
          <div className="h-full">Loading gigabyte package distribution...</div>
        }
      >
        <GigabytePackageDistributionChart />
      </Suspense>
    </div>
  );
}
