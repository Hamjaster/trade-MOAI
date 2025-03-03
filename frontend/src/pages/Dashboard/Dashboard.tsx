import { TradesPerDay } from "@/components/dashboard/trades-per-day";
import { WinRatePercentages } from "@/components/dashboard/win-rate-percentage";
import { TotalProfitLoss } from "@/components/dashboard/total-profit-loss";
import { BestSetups } from "@/components/dashboard/best-setups";
import { MonthlyGoal } from "@/components/dashboard/monthly-goal";
import { TradesTable } from "@/components/dashboard/trades-table";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { getTrades } from "@/store/tradeSlice";

export default function DashboardPage() {
  const { trades } = useAppSelector((state) => state.trade);
  const d = useAppDispatch();
  useEffect(() => {
    d(getTrades());
  }, [d]);
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Trade MOAI Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        <TradesPerDay />
        <WinRatePercentages />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
        <TotalProfitLoss />
        <BestSetups />
        <MonthlyGoal />
      </div>
      <div className="bg-white p-6 rounded-lg shadow w-full">
        <div className="h2 text-2xl font-semibold mb-4">Trades</div>
        <TradesTable isPaginated={true} trades={trades} />
      </div>
    </div>
  );
}
