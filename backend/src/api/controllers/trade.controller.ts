import csvParser from "csv-parser";
import fs from "fs";
import User from "../models/user.model.js";
import { ITrade, Trade } from "../models/trade.model.js";
import { promisify } from "util"
import readline from "readline"
import axios from 'axios'
import { fixDatasetErrors, getMonthsBetweenDates, parseDate } from "../../common/utils/services.js";
const unlinkAsync = promisify(fs.unlink);
import moment from 'moment';
import 'moment-timezone';
import mongoose from "mongoose";



// Updated Normalization Function for Schwab Data
const normalizeSchwabData = (csvData: any[]) => {

  return csvData.map((trade) => {
    if(!trade['Symbol']) return;

    const entryPrice = parseFloat(trade["Cost Per Share"]?.replace('$', '')) || 0
    const exitPrice = parseFloat(trade["Proceeds Per Share"]?.replace('$', '')) || 0
    const profitLossPercentage = parseFloat(trade["Gain/Loss (%)"]?.replace('%', '')) || 0;
    const action =
    trade["Name"].split(' ')[0];
    const symbol = trade["Symbol"].split(' ')[0];

    return {
      closedDate: new Date(trade["Closed Date"]),
      openedDate: new Date(trade["Opened Date"]),
      ticker : symbol,
      action,
      quantity: parseFloat(trade["Quantity"]),
      exitPrice,
      entryPrice,
      positionSize: parseFloat(trade["Cost Basis (CB)"]?.replace('$', '')) || 0,
      exitValue : parseFloat(trade["Proceeds"]?.replace('$', '')) || 0,
      netProfitLoss : parseFloat(trade["Gain/Loss ($)"]?.replace('$', '')) || 0,
      profitLossPercentage,
      isWashSale: trade["Wash Sale?"] === "Yes",
    };
  });
};


// Upload and process CSV file
export const uploadCSVBulk =async (req : any, res : any) => {
    
  const userId = req.user._id;
  console.log(userId, 'USER ID')
  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Parse the CSV file
    const trades: any[] = [];
    const filePath = req.file.path;
    const tempFilePath = `${filePath}.tmp`;

    // Step 1: Remove the first row (header or unnecessary row)
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      output: fs.createWriteStream(tempFilePath),
      terminal: false,
    });

    let isFirstRow = true;
    rl.on("line", (line) => {
      if (!isFirstRow) {
        rl.output.write(`${line}\n`);
      }
      isFirstRow = false;
    });

    await new Promise((resolve) => rl.on("close", resolve));

    fs.createReadStream(tempFilePath)
      .pipe(csvParser())
      .on("data", (row) => {trades.push(row)})
      .on("end", async () => {
        // Normalize the trades (assuming Schwab broker data)
        console.log(trades, "Trades to pass in")
        const normalizedTrades = normalizeSchwabData(trades).map((trade) => (
  {
          user: userId,
          ...trade,
        }
      )).filter((trade) => trade !== undefined);
        console.log(normalizedTrades, "NORMALIZED TRADES")
        // Save to the database
     await Trade.insertMany(normalizedTrades);
        const result = await Trade.find({ user: userId });
      console.log(result)
  // Cleanup temporary files
  await unlinkAsync(filePath);
  await unlinkAsync(tempFilePath);
        res.status(201).json({
          message: "Trades uploaded and normalized successfully",
          data: result,
        });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

}


export const getTrades = async (req :any, res :any) => {
    try {
        const  userId  = req.user._id;
    
        // Validate user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success : false,message: "User not found" });
    
        // Fetch trades
        const trades = await Trade.find({ user: userId });
        res.status(200).json({success : true, data : trades});
      } catch (error) {
        console.error(error);
        res.status(500).json({success : false, message: "Internal server error" });
      }
}



// Helper to calculate win rate
const calculateWinRate = (winningTrades: number, totalTrades: number) => {
  return totalTrades === 0 ? 0 : ((winningTrades / totalTrades) * 100).toFixed(2);
};

// 1. Overall Analytics
export const getTradeAnalytics = async (req: any, res: any) => {
  const userId  = req.user._id;

  try {
    const trades = await Trade.find({ user: userId });

    const totalTrades = trades.length;
    const winningTrades = trades.filter((trade) => trade.netProfitLoss > 0).length;
    const losingTrades = totalTrades - winningTrades;

    const totalProfitLoss = trades.reduce((acc, trade) => acc + trade.netProfitLoss, 0);

    res.json({
      totalTrades,
      winningTrades,
      losingTrades,
      totalProfitLoss,
      winRate: calculateWinRate(winningTrades, totalTrades),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error });
  }
};

// 2. Trades Per Month
export const getTradesPerMonth = async (req: any, res: any) => {
  const userId = req.user._id;

  try {
    const trades = await Trade.find({ user: userId });

    const tradesPerMonth = Array(12).fill(0);
    trades.forEach((trade) => {
      const month = new Date(trade.closedDate).getMonth();
      tradesPerMonth[month] += 1;
    });

    res.json({ tradesPerMonth });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trades per month', error });
  }
};

// 3. Trades Per Day
export const getTradesPerDay = async (req: any, res: any) => {
  const  userId  = req.user._id;

  try {
    const trades = await Trade.find({ user: userId });

    const tradesPerDay = Array(7).fill(0);
    trades.forEach((trade) => {
      const day = new Date(trade.closedDate).getDay(); // 0 = Sunday, 6 = Saturday
      tradesPerDay[day] += 1;
    });

    res.json({ tradesPerDay });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trades per day', error });
  }
};

// 4. Win Rate Percentage
export const getWinRatePercentage = async (req: any, res: any) => {
  const  userId = req.user._id;

  try {
    const trades = await Trade.find({ user: userId });
    const totalTrades = trades.length;
    const winningTrades = trades.filter((trade) => trade.netProfitLoss > 0).length;

    const winRate = calculateWinRate(winningTrades, totalTrades);

    res.json({ winRate });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating win rate', error });
  }
};


export const saveJournalEntry = async (req :any, res : any) => {
  try {
    const trade = await Trade.findById(req.params.id)
    if (!trade) {
      return res.status(404).json({success : false, message: "Trade not found" })
    }

    trade.journal = req.body
    await trade.save()

    res.json({success : true, data : trade})
  } catch (error : any) {
    res.status(500).json({ success : false, message: "Server error", data: error })
  }
}

export const getTradesSummary = async (req : any, res : any) => {
  try {
    const userId = req.user._id;
    const aggregationPipeline = [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$openedDate"
            }
          },
          totalPnL: { $sum: "$netProfitLoss" },
          tradeCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          pnl: "$totalPnL",
          noOfTrades: "$tradeCount"
        }
      },
      {
        $sort: {
          date: 1
        }
      }
    ];

    const dailyStats = await Trade.aggregate(aggregationPipeline);


    res.json({success : true, data : dailyStats});
  } catch (error) {
    console.error("Error fetching trades summary:", error);
    res.status(500).json({ success : false, message: "Internal server error" });
  }
}

// Function to fetch and cache historical data
// export const getHistoricalData = async (req: any, res: any) => {
//   try {
//     const { tradeId, symbol, from, to } = req.body;
//     console.log('fetching data btw', from, ' and ', to)
//     // Check if cached data exists in the Trade collection
//     // Find the trade by ID
//     const trade = await Trade.findById(tradeId);
//     if (!trade) {
//       return res.status(404).json({ message: "rade not found" });
//     }
//     // Check if the historicalData array is empty
//     const isHistoricalDataEmpty = trade.historicalData.length === 0;


//     if (!isHistoricalDataEmpty) {
//       console.log("Returning cached trade :", symbol);
//        res.json({ success: true, data: trade });
//        return;
//     }else{
//       const URL = `https://api.marketstack.com/v2/intraday?access_key=37dda095632e96f30e1925ff75335626&symbols=${symbol}&date_from=${from}&date_to=${to}&interval=15min`
//       // const URL = `https://api.marketstack.com/tickers/${symbol}/intraday/?access_key=37dda095632e96f30e1925ff75335626`
//       // const URL = "https://api.marketstack.com/v1/intraday?access_key=37dda095632e96f30e1925ff75335626&symbols=AAPL"
//       console.log(URL, 'url')
//       // Fetch data from Marketstack API if not cached
//       const response = await axios.get(URL);
  
//       if (!response.data) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Details not found for this ticker" });
//       }
  
//       // Format the data
//       let formattedData = response.data.data.map((item: any) => ({
//         time: new Date(item.date).getTime() / 1000,
//         open: parseFloat(item.open),
//         high: parseFloat(item.high),
//         low: parseFloat(item.low),
//         close: parseFloat(item.close),
//         volume: parseInt(item.volume) || 0,
//       }));
//       formattedData = fixDatasetErrors(formattedData)
//       // Sort the formatted data by time in ascending order
//       formattedData.sort((a, b) => a.time - b.time);

//       // console.log(formattedData, 'formatted DATA');
  
//       if(!formattedData[0]) {
//         return res.status(404).json({ success: false, message: "No data found" });
//       }
  
//       const tradeUpdatedWithHistoricalData = await Trade.findByIdAndUpdate(tradeId, {   historicalData: formattedData || []  }, { new: true });
  
//       console.log("Fetched and cached data for:", symbol);
//       res.json({ success: true, data: tradeUpdatedWithHistoricalData });
//     }

    
//   } catch (error: any) {
//     console.error("Error fetching historical data:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch historical data",
//       error: error,
//     });
//   }
// };



// Modified function using Alpha Vantage
export const getHistoricalData = async (req: any, res: any) => {
  try {
    const { tradeId, symbol, from, to } = req.body;
    const API_KEY = 'G2Y4KD8NAAKVSNDW'; // Replace with your key
    const INTERVAL = '5min'; // Match your desired interval

    console.log('Fetching data between', from, 'and', to);

    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    if (trade.historicalData.length > 0) {
      console.log("Returning cached data for:", symbol);
      return res.json({ success: true, data: trade });
    }

    // Get all months needed for the date range
    const months = getMonthsBetweenDates(new Date(from), new Date(to));
    let allData: any[] = [];

    // Fetch data for each month
    for (const month of months) {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${INTERVAL}&apikey=${API_KEY}&outputsize=full&month=${month}`;
      
      console.log('Fetching from:', url);
      const response = await axios.get(url);
      
      if (!response.data || response.data.Note) {
        console.error('API limit reached or error:', response.data?.Note);
        continue;
      }

      const timeSeries = response.data[`Time Series (${INTERVAL})`];
      if (!timeSeries) continue;

      // Process data points
      const formattedData = Object.entries(timeSeries).map(([timestamp, values]: [string, any]) => {
        // Convert to Unix timestamp (UTC)
        const utcTimestamp = moment.tz(timestamp, 'YYYY-MM-DD HH:mm:ss', 'America/New_York').unix();
        
        return {
          time: utcTimestamp,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']) || 0,
        };
      });

      allData = [...allData, ...formattedData];
    }

    // Filter data by date range
    const fromTimestamp = moment(from).unix();
    const toTimestamp = moment(to).unix();
    
    const filteredData = allData.filter(item => 
      item.time >= fromTimestamp && item.time <= toTimestamp
    );

    // Sort data by time
    filteredData.sort((a, b) => a.time - b.time);

    if (filteredData.length === 0) {
      return res.status(404).json({ success: false, message: "No data found for given range" });
    }

    // Update trade with historical data
    const updatedTrade = await Trade.findByIdAndUpdate(
      tradeId,
      { historicalData: filteredData },
      { new: true }
    );

    console.log("Fetched and cached data for:", symbol);
    res.json({ success: true, data: updatedTrade });

  } catch (error: any) {
    console.error("Error fetching historical data:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch historical data",
      error: error.message,
    });
  }
};
