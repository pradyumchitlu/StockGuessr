const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

// Curated list of liquid, well-known S&P 500 stocks
const STOCK_UNIVERSE = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'JNJ',
    'LLY', 'NKE', 'UNH', 'HD', 'MA', 'BAC', 'XOM', 'PFE', 'KO', 'PEP',
    'COST', 'DIS', 'CSCO', 'VZ', 'ADBE', 'NFLX', 'ORCL', 'AMD', 'CRM', 'DE',
    'MCD', 'T', 'ORCL', 'IBM', 'GS', 'TSLA', 'TXN', 'QCOM', 'INTC', 'CAT',
    'BA', 'GEV', 'GE', 'CRWV', 'LMT', 'RTX', 'SBUX', 'COF', 'NTNX', 'ALAB'
];

/**
 * Get a random ticker from the stock universe
 */
const getRandomTicker = () => {
    const randomIndex = Math.floor(Math.random() * STOCK_UNIVERSE.length);
    return STOCK_UNIVERSE[randomIndex];
};

/**
 * Get a random historical period for the game
 * Returns dates for ~13 months total: 12 months context + 1 month game
 * Period must be at least 1 year ago to ensure data is complete
 */
const getRandomHistoricalPeriod = () => {
    const now = new Date();

    // Pick a random end date between 1 and 5 years ago
    const yearsAgo = 1 + Math.floor(Math.random() * 4); // 1-4 years
    const monthOffset = Math.floor(Math.random() * 12); // Random month within that year

    const gameEndDate = new Date(now);
    gameEndDate.setFullYear(gameEndDate.getFullYear() - yearsAgo);
    gameEndDate.setMonth(gameEndDate.getMonth() - monthOffset);

    // Game is 4 weeks (20 trading days ≈ 1 month)
    const gameStartDate = new Date(gameEndDate);
    gameStartDate.setMonth(gameStartDate.getMonth() - 1);

    // Context is 12 months before game starts (for full year of historical data)
    const contextStartDate = new Date(gameStartDate);
    contextStartDate.setMonth(contextStartDate.getMonth() - 12);

    return {
        contextStartDate,
        gameStartDate,
        gameEndDate
    };
};

/**
 * Fetch historical OHLC data from Yahoo Finance
 */
const fetchOHLCData = async (ticker, startDate, endDate) => {
    try {
        const queryOptions = {
            period1: startDate,
            period2: endDate,
            interval: '1d'
        };

        const result = await yahooFinance.chart(ticker, queryOptions);

        if (!result || !result.quotes || result.quotes.length === 0) {
            throw new Error(`No data found for ${ticker}`);
        }

        // Transform to our candle format
        const candles = result.quotes
            .filter(q => q.open && q.high && q.low && q.close && q.volume)
            .map(q => ({
                date: new Date(q.date),
                open: parseFloat(q.open.toFixed(2)),
                high: parseFloat(q.high.toFixed(2)),
                low: parseFloat(q.low.toFixed(2)),
                close: parseFloat(q.close.toFixed(2)),
                volume: q.volume
            }));

        return candles;
    } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error.message);
        throw error;
    }
};

/**
 * Split candles into context (12 months) and game (4 weeks = 20 trading days)
 */
const splitCandlesForGame = (candles) => {
    // Game is the last 20 trading days
    const gameCandles = candles.slice(-20);
    // Context is everything before that
    const contextCandles = candles.slice(0, -20);

    return { contextCandles, gameCandles };
};

/**
 * Classify difficulty based on volatility
 */
const classifyDifficulty = (candles) => {
    if (candles.length < 10) return 'MEDIUM';

    // Calculate average daily move
    let totalMove = 0;
    for (const candle of candles) {
        const move = Math.abs((candle.close - candle.open) / candle.open);
        totalMove += move;
    }
    const avgMove = totalMove / candles.length;

    // Classify based on average move
    if (avgMove > 0.03) return 'HARD';      // > 3% avg daily move
    if (avgMove < 0.01) return 'EASY';      // < 1% avg daily move
    return 'MEDIUM';
};

/**
 * Get company name for a ticker
 */
const getCompanyName = async (ticker) => {
    try {
        const quote = await yahooFinance.quote(ticker);
        return quote.shortName || quote.longName || ticker;
    } catch (error) {
        console.warn(`Could not fetch name for ${ticker}, using ticker`);
        return ticker;
    }
};

module.exports = {
    STOCK_UNIVERSE,
    getRandomTicker,
    getRandomHistoricalPeriod,
    fetchOHLCData,
    splitCandlesForGame,
    classifyDifficulty,
    getCompanyName
};
