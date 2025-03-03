import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store";
import { ITrade } from "@/store/tradeSlice";
import { useState } from "react";

interface JournalEntryFormProps {
  trade: ITrade;
  onSubmit: (data: any) => void;
}

export function JournalEntryForm({ trade, onSubmit }: JournalEntryFormProps) {
  const { isSavingJournal } = useAppSelector((state) => state.trade);
  const [formData, setFormData] = useState({
    riskFactor: trade.journal?.riskFactor || "",
    strategy: trade.journal?.strategy || "",
    personalThoughts: trade.journal?.personalThoughts || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Journal Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Journal Date
            </label>
            <input
              type="text"
              value={new Date().toLocaleDateString()}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ticker
            </label>
            <input
              type="text"
              value={trade.ticker}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Entry Date/Time
            </label>
            <input
              type="text"
              value={new Date(trade.openedDate).toDateString()}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Exit Date/Time
            </label>
            <input
              type="text"
              value={new Date(trade.closedDate).toDateString()}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="text"
              value={trade.quantity}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profit/Loss
            </label>
            <input
              type="text"
              value={`$${trade.netProfitLoss.toFixed(
                2
              )} (${trade.profitLossPercentage.toFixed(2)}%)`}
              readOnly
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                trade.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Risk Factor
          </label>
          <input
            type="text"
            name="riskFactor"
            value={formData.riskFactor}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter risk factor..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Strategy
          </label>
          <textarea
            name="strategy"
            value={formData.strategy}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Describe your trading strategy..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Personal Thoughts
          </label>
          <textarea
            name="personalThoughts"
            value={formData.personalThoughts}
            onChange={handleChange}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Share your thoughts about this trade..."
          />
        </div>

        <Button
          isLoading={isSavingJournal}
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save Journal Entry
        </Button>
      </form>
    </div>
  );
}
