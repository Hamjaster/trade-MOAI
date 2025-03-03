import mongoose, { Schema, Document } from "mongoose";
import axios from "axios";

// Trade model interface and schema
export interface ITrade extends Document {
  user: mongoose.Types.ObjectId;
  closedDate: Date;
  openedDate: Date;
  ticker: string;
  action: "CALL" | "PUT";
  quantity: number;
  entryPrice : number;
  exitPrice : number;
    // Monetary Values
    positionSize: number;       // Was totalBuying
    exitValue: number;          // Was totalSelling
  
  netProfitLoss: number;
  profitLossPercentage: number;
  isWashSale: boolean;
  journal: {
    riskFactor: string;
    strategy: string;
    personalThoughts: string;
  };
  historicalData: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>; // Historical data
}

const TradeSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  closedDate: { type: Date, required: true },
  openedDate: { type: Date, required: true },
  ticker: { type: String, required: true },
  action: { type: String, enum: ["CALL", "PUT"], required: true },
  quantity: { type: Number, required: true },
  entryPrice : { type: Number, required: true },
  exitPrice : { type: Number, required: true },
    // Monetary Values
    positionSize: { type: Number, required: true },      // Was totalBuying
    exitValue: { type: Number, required: true },        // Was totalSelling
  
  netProfitLoss: { type: Number, required: true },
  profitLossPercentage: { type: Number, required: false },
  isWashSale: { type: Boolean, required: true },
  journal: {
    riskFactor: String,
    strategy: String,
    personalThoughts: String,
  },
  historicalData: [
    {
      time: Number,
      open: Number,
      high: Number,
      low: Number,
      close: Number,
      volume: Number,
    },
  ],
});

export const Trade = mongoose.model<ITrade>("Trade", TradeSchema);
