import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch } from "@/store";
import { ITrade, setTradeToJournal } from "@/store/tradeSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function TradesTable({
  trades,
  isPaginated = false,
}: {
  trades: ITrade[];
  isPaginated?: boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(trades.length / pageSize);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const paginatedTrades = trades.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Opening Date</TableHead>
            <TableHead>Closing Date</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Exit Price</TableHead>
            <TableHead>Profit/Loss ($)</TableHead>
            <TableHead>Profit/Loss (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTrades.length > 0 ? (
            paginatedTrades.map((trade) => (
              <TableRow
                onClick={() => {
                  dispatch(setTradeToJournal(trade));
                  navigate("/dashboard/journal");
                }}
                key={trade._id}
              >
                <TableCell>{trade.ticker}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>
                  {new Date(trade.openedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(trade.closedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{trade.entryPrice}</TableCell>
                <TableCell>{trade.exitPrice}</TableCell>
                <TableCell
                  className={
                    trade.netProfitLoss > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {trade.netProfitLoss}$
                </TableCell>
                <TableCell
                  className={
                    trade.profitLossPercentage > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {trade.profitLossPercentage?.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No trades found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination Controls */}
      {isPaginated && (
        <div className="flex justify-between mt-4">
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
