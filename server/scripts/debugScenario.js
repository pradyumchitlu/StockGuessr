// Debug Scenario Data Fetching
require('dotenv').config();
const { getRandomTicker, getRandomHistoricalPeriod, fetchOHLCData, splitCandlesForGame } = require('../src/utils/stockData');

async function debugScenario() {
    console.log('--- Debugging Scenario Generation ---');

    try {
        const ticker = getRandomTicker();
        const period = getRandomHistoricalPeriod();

        console.log(`Ticker: ${ticker}`);
        console.log(`Context Start: ${period.contextStartDate.toISOString()}`);
        console.log(`Game Start:    ${period.gameStartDate.toISOString()}`);
        console.log(`Game End:      ${period.gameEndDate.toISOString()}`);

        console.log('Fetching candles...');
        const allCandles = await fetchOHLCData(ticker, period.contextStartDate, period.gameEndDate);
        console.log(`Total candles fetched: ${allCandles.length}`);

        if (allCandles.length > 0) {
            console.log(`First candle: ${allCandles[0].date.toISOString()}`);
            console.log(`Last candle:  ${allCandles[allCandles.length - 1].date.toISOString()}`);
        }

        const { contextCandles, gameCandles } = splitCandlesForGame(allCandles);
        console.log(`Context candles: ${contextCandles.length}`);
        console.log(`Game candles:    ${gameCandles.length}`);

        if (contextCandles.length < 50) {
            console.warn('WARNING: Low context candle count!');
        } else {
            console.log('SUCCESS: Sufficient context candles.');
        }

    } catch (error) {
        console.error('ERROR:', error.message);
    }
}

debugScenario();
