import { Suspense } from "react";
import { ProviderDistributionChart } from "@/components/provider-distribution-chart";
import { GigabytePackageDistributionChart } from "@/components/gigabyte-package-distribution-chart";
import { ContractStartMonthChart } from "@/components/contract_start_month_chart";

export function PieChartContainer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Suspense fallback={<div>Loading provider distribution...</div>}>
        <ProviderDistributionChart />
      </Suspense>
      <Suspense fallback={<div>Loading contract start month distribution...</div>}>
        <ContractStartMonthChart />
      </Suspense>
      <Suspense fallback={<div>Loading gigabyte package distribution...</div>}>
        <GigabytePackageDistributionChart />
      </Suspense>
    </div>
  );
}