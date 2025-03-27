import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  type UTCTimestamp,
  Time,
} from "lightweight-charts";
import { ITrade } from "@/store/tradeSlice";
import { DateTime } from "luxon";
import {
  BackgroundShadeSeries,
  SessionHighlighting,
} from "@/components/ui/ChartBGPlugin/session-highlighting";
import { getDate } from "date-fns";
interface TradeChartProps {
  data: {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  trades: ITrade[];
}

export function TradeChart({ data, trades }: TradeChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [timezone, setTimezone] = useState<"EST" | "local">("EST");

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
        fontSize: 14,
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      // Add time scale configuration here
      timeScale: {
        timeVisible: true, // Show time in addition to date
        secondsVisible: false, // Set to true if you need seconds
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(data);

    // Add markers for trades

    const markers = trades.flatMap((trade) => {
      const openedDate = new Date(
        new Date(trade.openedDate).getTime() + 40 * 60 * 1000
      );
      const closedDate = new Date(trade.closedDate);
      const isSameDay = openedDate.toDateString() === closedDate.toDateString();

      let entryTime = Math.floor(openedDate.getTime() / 1000) as UTCTimestamp;
      let exitTime = Math.floor(closedDate.getTime() / 1000) as UTCTimestamp;

      if (isSameDay) {
        const dayStart =
          new Date(openedDate.setHours(15, 0, 0, 0)).getTime() / 1000;
        const dayEnd =
          new Date(closedDate.setHours(23, 59, 59, 999)).getTime() / 1000;
        entryTime = dayStart as UTCTimestamp;
        exitTime = dayEnd as UTCTimestamp;
      }
      console.log(entryTime, "ENTRY UTC");

      return [
        {
          time: entryTime,
          close: trade.entryPrice,
          position: trade.action === "CALL" ? "belowBar" : "aboveBar",
          color: trade.action === "CALL" ? "#4CAF50" : "#FF5252",
          shape: trade.action === "CALL" ? "arrowUp" : "arrowDown",
          text: `${trade.action} Entry @ ${trade.entryPrice}`,
        },

        {
          time: exitTime,
          close: trade.exitPrice,
          position: trade.action === "CALL" ? "aboveBar" : "belowBar",
          color: trade.action === "CALL" ? "#FF5252" : "#4CAF50",
          shape: "square",
          text: `Exit @ ${trade.exitPrice}`,
        },
      ];
    });

    candlestickSeries.setMarkers(markers);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, trades]);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.applyOptions({
      timeScale: {
        tickFormatter: (time: number) => {
          const date = DateTime.fromSeconds(time).setZone(
            timezone === "EST" ? "America/New_York" : "local"
          );
          return date.toFormat("HH:mm");
        },
      },
    });
  }, [timezone]);

  return (
    <div className="w-full">
      {/* <div className="p-2">
        <button
          onClick={() =>
            setTimezone((prev) => (prev === "EST" ? "local" : "EST"))
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Switch to {timezone === "EST" ? "Local Time" : "EST"}
        </button>
      </div> */}
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
}
