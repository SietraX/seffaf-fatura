"use client";

import React, { useMemo } from "react";
import { CustomCard } from "@/components/ui/custom-card";
import { useBillData } from "@/contexts/BillDataContext";

interface MostSelectedGB {
  gbSize: number;
  count: number;
}

export function CardContainer() {
  const { billData, isLoading, error } = useBillData();

  const stats = useMemo(() => {
    if (!billData.length)
      return {
        total: 0,
        last30Days: 0,
        last24Hours: 0,
        prev30Days: 0,
        prevDay: 0,
        mostSelectedGB: { gbSize: 0, count: 0 } as MostSelectedGB,
      };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const gbPackages: Record<number, number> = {};

    const result = billData.reduce(
      (acc, bill) => {
        const billDate = new Date(bill.updated_at);
        acc.total++;
        if (billDate >= thirtyDaysAgo) acc.last30Days++;
        if (billDate >= sixtyDaysAgo && billDate < thirtyDaysAgo)
          acc.prev30Days++;
        if (billDate >= oneDayAgo) acc.last24Hours++;
        if (billDate >= twoDaysAgo && billDate < oneDayAgo) acc.prevDay++;

        // Count GB packages
        if (bill.gigabyte_package) {
          gbPackages[bill.gigabyte_package] =
            (gbPackages[bill.gigabyte_package] || 0) + 1;
        }

        return acc;
      },
      { total: 0, last30Days: 0, last24Hours: 0, prev30Days: 0, prevDay: 0 }
    );

    // Find the most selected GB package
    const mostSelectedGB = Object.entries(gbPackages).reduce<MostSelectedGB>(
      (max, [gbSize, count]) => {
        return count > max.count ? { gbSize: Number(gbSize), count } : max;
      },
      { gbSize: 0, count: 0 }
    );

    return { ...result, mostSelectedGB };
  }, [billData]);

  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">Loading...</div>
    );
  if (error)
    return (
      <div className="h-full flex items-center justify-center">
        Error: {error}
      </div>
    );

  const percentChange30Days =
    stats.prev30Days === 0
      ? stats.last30Days > 0
        ? 100
        : 0
      : (
          ((stats.last30Days - stats.prev30Days) / stats.prev30Days) *
          100
        ).toFixed(1);
  const percentChange24Hours =
    stats.prevDay === 0
      ? stats.last24Hours > 0
        ? 100
        : 0
      : (((stats.last24Hours - stats.prevDay) / stats.prevDay) * 100).toFixed(
          1
        );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      <CustomCard
        title="Toplam Kullanıcı"
        content={<div className="text-xl sm:text-2xl font-bold">{stats.total}</div>}
        footer={
          <div className="text-xs text-muted-foreground">
            kişi katılım gösterdi
          </div>
        }
      />
      <CustomCard
        title="Aylık"
        content={<div className="text-xl sm:text-2xl font-bold">{stats.last30Days}</div>}
        footer={
          <div
            className={`text-xs ${
              Number(percentChange30Days) >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {percentChange30Days}% önceki aya göre
          </div>
        }
      />
      <CustomCard
        title="Günlük"
        content={<div className="text-xl sm:text-2xl font-bold">{stats.last24Hours}</div>}
        footer={
          <div
            className={`text-xs ${
              Number(percentChange24Hours) >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {percentChange24Hours}% düne göre
          </div>
        }
      />
      <CustomCard
        title="En Çok Tercih Edilen GB"
        content={
          <div className="text-xl sm:text-2xl font-bold">
            {stats.mostSelectedGB.gbSize || "N/A"} GB
          </div>
        }
        footer={
          <div className="text-xs text-muted-foreground">
            {stats.mostSelectedGB.count} defa tercih edildi
          </div>
        }
      />
    </div>
  );
}
