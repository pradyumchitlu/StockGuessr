const mongoose = require('mongoose');

const candleSchema = new mongoose.Schema({
  date: Date,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
});

const newsSchema = new mongoose.Schema({
  week: Number,
  headline: String,
  date: Date,
});

const stockScenarioSchema = new mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    contextCandles: [candleSchema], // Previous 3 months for context
    gameCandles: [candleSchema], // 4 weeks of game candles
    news: [newsSchema],
    description: String,
    difficulty: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD'],
      default: 'MEDIUM',
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockScenario', stockScenarioSchema);
