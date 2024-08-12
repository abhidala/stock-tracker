import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";
const KEY = process.env.KEY || "";
app.use(cors({
  origin: 'http://localhost:3000'
}));
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as any).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

const stockSchema = new mongoose.Schema({
  symbol: String,
  current_price: Number,
  days_high:Number,
  days_low:Number,
  open_price:Number,
  previous_close:Number,
  timestamp: { type: Date, default: Date.now }
});

const Stock = mongoose.model('Stock', stockSchema);
const fetchWithRetry = async (url: string, retries: number = 5, delay: number = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error: any) {
      if (error.code === 'ECONNRESET' || error.code === 'ENETUNREACH') {
        console.error(`Network error: ${error.message}. Retrying... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; 
      }
    }
  }
  throw new Error('Failed to fetch data after multiple attempts');
};
const fetchStockData = async () => {
  try {
    const symbols = ['GOOG', 'BTC','AAPL','MSFT','AMZN'];
    const responses = await Promise.all(symbols.map(symbol => fetchWithRetry(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${KEY}`).then(response=>({symbol,data:response.data})).catch(error=>{console.error(`Error fetching data for ${symbol}:`,error.message); return null;})));
    console.log(responses);
    const validResponses = responses.filter((response): response is { symbol: string; data: any } => response !== null);
    validResponses.forEach(({symbol,data}) => {
      const stockData = new Stock({
        symbol,
        current_price: data.c,
        days_high:data.h,
        days_low:data.l,
        open_price:data.o,
        previous_close:data.pc
      });
      stockData.save();
    });
  } catch (error) {
    console.error(error);
  }
};


cron.schedule('*/5 * * * * *', fetchStockData); 

app.get('/stocks/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const stocks = await Stock.find({ symbol }).sort({ timestamp: -1 }).limit(20);
    res.json(stocks);
  } catch (error:any) {
    res.status(500).send(error.message || error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
