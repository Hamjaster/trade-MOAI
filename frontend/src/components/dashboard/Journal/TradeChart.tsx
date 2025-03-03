import { useEffect, useRef } from "react";
import { createChart, ColorType, type UTCTimestamp } from "lightweight-charts";
import { ITrade } from "@/store/tradeSlice";

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

    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(data);

    // Add markers for trades

    const markers = trades.flatMap((trade) => {
      const openedDate = new Date(trade.openedDate);
      const closedDate = new Date(trade.closedDate);
      const isSameDay = openedDate.toDateString() === closedDate.toDateString();

      let entryTime = Math.floor(openedDate.getTime() / 1000) as UTCTimestamp;
      let exitTime = Math.floor(closedDate.getTime() / 1000) as UTCTimestamp;

      if (isSameDay) {
        const dayStart =
          new Date(openedDate.setHours(0, 0, 0, 0)).getTime() / 1000;
        const dayEnd =
          new Date(closedDate.setHours(23, 59, 59, 999)).getTime() / 1000;
        entryTime = dayStart as UTCTimestamp;
        exitTime = dayEnd as UTCTimestamp;
      }
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

  return <div ref={chartContainerRef} className="w-full" />;
}
