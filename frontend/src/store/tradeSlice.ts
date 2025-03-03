import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { UTCTimestamp } from 'lightweight-charts';


// Trade model interface and schema
export interface ITrade extends Document {
  user: string ;
  _id : string;
  closedDate: string;
  openedDate: string;
  ticker: string;
  action:"CALL" | "PUT";
  quantity: number;
  entryPrice : number;
  exitPrice : number;
    // Monetary Values
    positionSize: number;       // Was totalBuying
    exitValue: number;          // Was totalSelling
  
  netProfitLoss?: number;
  profitLossPercentage?: number;
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


export type TradeSummary = {
  date: string;
  pnl: number;
  noOfTrades: number;
}
type TradeState = {
  tradeToJournal : ITrade | null;
  trades: ITrade[];
  isLoading: boolean;
  isSavingJournal : boolean;
  error: string | null;
  success: string | null;
  analytics: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    totalProfitLoss: number;
    winRate: string;
    tradesPerMonth: number[];
    tradesPerDay: number[];
  } | null;
  tradesSummary : TradeSummary[];
};

export const uploadTrades = createAsyncThunk(
  'trade/uploadTrades',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post(`/trades/upload-bulk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const getTrades = createAsyncThunk(
  'trade/getTrades',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/trades/get`);
      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTradesSummary = createAsyncThunk(
  'trade/summary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/trades/calendar`);
      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getTradeAnalytics = createAsyncThunk(
  'trade/getTradeAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/trades/analytics`);
      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTradesPerMonth = createAsyncThunk(
  'trade/getTradesPerMonth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/trades/analytics/trades-per-month`);
      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getTradesPerDay = createAsyncThunk(
  'trade/getTradesPerDay',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/trades/analytics/trades-per-day`);
      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getWinRatePercentage = createAsyncThunk(
  'trade/getWinRatePercentage',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/trades/analytics/win-rate`);
      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchHistoricalData = createAsyncThunk(
  'trade/fetchHistoricalData',
  async ({ tradeId, symbol, from, to }: { tradeId : string;symbol: string; from: string; to: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/trades/getHistoricData`, {tradeId, symbol, from, to });
      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const saveJournalEntry = createAsyncThunk(
  'trade/saveJournal',
  async ({tradeId , journalData} : {tradeId : string, journalData : any}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/trades/journal/${tradeId}`, journalData)

      if (response.data.success === false) {
        return rejectWithValue(response.data.message);
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    isSavingJournal : false,
    tradeToJournal : null,
    trades: [],
    isLoading: false,
    error: null,
    success: null,
    analytics: null,
    tradesSummary   : [],

  } as TradeState,
  reducers: {
    setTradeToJournal : (state, action) => {
      state.tradeToJournal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadTrades.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(uploadTrades.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload, 'pushing new TRADESs')
        state.trades.push(action.payload) 
        state.success = 'Trades uploaded successfully';
      })
      .addCase(uploadTrades.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      .addCase(getTrades.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trades = action.payload;
        state.success = 'Trades fetched successfully';
      })
      .addCase(getTrades.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      .addCase(getTradeAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTradeAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Trade analytics fetched successfully';
        state.analytics = {
          ...state.analytics,
          totalTrades: action.payload.totalTrades,
          winningTrades: action.payload.winningTrades,
          losingTrades: action.payload.losingTrades,
          totalProfitLoss: action.payload.totalProfitLoss,
          winRate: action.payload.winRate,
        };
      })
      .addCase(getTradeAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      .addCase(getTradesSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTradesSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Trade analytics fetched successfully';
        state.tradesSummary = action.payload;
      })
      .addCase(getTradesSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      .addCase(getTradesPerMonth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTradesPerMonth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Trades per month fetched successfully';
        state.analytics = {
          ...state.analytics,
          tradesPerMonth: action.payload.tradesPerMonth,
        };
      })
      .addCase(getTradesPerMonth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      .addCase(getTradesPerDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getTradesPerDay.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Trades per day fetched successfully';
        state.analytics = {
          ...state.analytics,
          tradesPerDay: action.payload.tradesPerDay,
        };
      })
      .addCase(getTradesPerDay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      .addCase(getWinRatePercentage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getWinRatePercentage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Win rate percentage fetched successfully';
        state.analytics = {
          ...state.analytics,
          winRate: action.payload.winRate,
        };
      })
      .addCase(getWinRatePercentage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      .addCase(fetchHistoricalData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Historical data fetched successfully';
        state.trades = state.trades.map((trade) => {
          if (trade._id === state.tradeToJournal?._id) {
            trade = action.payload;
          }
          return trade;
        }
      );
      state.tradeToJournal = action.payload
        // update the trades array and the traddeToJournal object when the action.payloadd returns the updadted Trade
        
      })
      .addCase(fetchHistoricalData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = null;
      })
      .addCase(saveJournalEntry.pending, (state) => {
        state.isSavingJournal = true;
        state.error = null;
        state.success = null;
      })
      .addCase(saveJournalEntry.fulfilled, (state, action) => {
        state.isSavingJournal = false;
        state.success = 'Historical data fetched successfully';
        state.trades = state.trades.map((trade) => {
          if (trade._id === state.tradeToJournal?._id) {
            trade = action.payload;
          }
          return trade;
        }
      );
      state.tradeToJournal = action.payload
        // update the trades array and the traddeToJournal object when the action.payloadd returns the updadted Trade
        
      })
      .addCase(saveJournalEntry.rejected, (state, action) => {
        state.isSavingJournal = false;
        state.error = action.payload as string;
        state.success = null;
      })
  },
});

export const {setTradeToJournal} = tradeSlice.actions

export default tradeSlice.reducer;
