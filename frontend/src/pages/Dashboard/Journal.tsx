import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { api } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchHistoricalData,
  ITrade,
  saveJournalEntry,
} from "@/store/tradeSlice";
import { TradeChart } from "@/components/dashboard/Journal/TradeChart";
import { JournalEntryForm } from "@/components/dashboard/Journal/JournalEntryForm";
import { Loader2 } from "lucide-react";
import { formatDateForAPI } from "@/lib/utils";

export function JournalPage() {
  const { tradeToJournal, isLoading, isSavingJournal } = useAppSelector(
    (state) => state.trade
  );

  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  // let historicalData = [
  //   {
  //     time: 1703864400, // 2024-12-29 18:55:00 UTC
  //     open: 2.4,
  //     high: 2.45,
  //     low: 2.39,
  //     close: 2.42,
  //     volume: 5000,
  //   },
  //   {
  //     time: 1703864700, // 2024-12-29 19:00:00 UTC (your trade time)
  //     open: 2.42,
  //     high: 2.48,
  //     low: 2.41,
  //     close: 2.46, // Your buying/selling price
  //     volume: 7000,
  //   },
  //   {
  //     time: 1703865000, // 2024-12-29 19:05:00 UTC
  //     open: 2.46,
  //     high: 2.5,
  //     low: 2.45,
  //     close: 2.47,
  //     volume: 6000,
  //   },
  //   {
  //     time: 1703865300, // 2024-12-29 19:10:00 UTC
  //     open: 2.47,
  //     high: 2.52,
  //     low: 2.46,
  //     close: 2.5,
  //     volume: 8000,
  //   },
  //   {
  //     time: 1703865600, // 2024-12-29 19:15:00 UTC
  //     open: 2.5,
  //     high: 2.55,
  //     low: 2.49,
  //     close: 2.54,
  //     volume: 9000,
  //   },
  //   {
  //     time: 1703865900, // 2024-12-29 19:20:00 UTC
  //     open: 2.54,
  //     high: 2.58,
  //     low: 2.53,
  //     close: 2.56,
  //     volume: 8500,
  //   },
  // ];
  // const historicalData = useAppSelector((state) => state.historicalData.data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetchLoading(true);
        if (!tradeToJournal) return;

        let from = new Date(tradeToJournal.openedDate);
        from.setDate(from.getDate() - 2); // Subtract 4 days

        let to = new Date(tradeToJournal.closedDate);
        to.setDate(to.getDate() + 2); // Add 4 days

        dispatch(
          fetchHistoricalData({
            tradeId: tradeToJournal._id,
            symbol: tradeToJournal.ticker,
            from: formatDateForAPI(from),
            to: formatDateForAPI(to),
          })
        );
        console.log("got data");
        setIsFetchLoading(false);
      } catch (err) {
        setError("Failed to load trade data");
        setIsFetchLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJournalSubmit = async (journalData: any) => {
    try {
      if (!tradeToJournal) return;
      dispatch(saveJournalEntry({ tradeId: tradeToJournal._id, journalData }));
      // Show success message or redirect
    } catch (err) {
      setError("Failed to save journal entry");
    }
  };

  if (error) return <div className="text-red-600 text-center p-4">{error}</div>;
  if (!tradeToJournal)
    return <div className="text-center p-4">Trade not found</div>;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Trade Journal: {tradeToJournal.ticker} -{" "}
        {new Date(tradeToJournal.closedDate).toLocaleDateString()}
      </h1>

      {!isFetchLoading ? (
        tradeToJournal.historicalData[0] ? (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <TradeChart
              data={tradeToJournal.historicalData}
              trades={[tradeToJournal]}
            />
          </div>
        ) : (
          <></>
        )
      ) : (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <JournalEntryForm trade={tradeToJournal} onSubmit={handleJournalSubmit} />
    </div>
  );
}
