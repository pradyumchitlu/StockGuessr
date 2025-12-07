const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate post-game trade analysis using AI
 * @param {Object} params - Analysis parameters
 * @param {Array} params.trades - Array of trades made during the game
 * @param {Array} params.gameCandles - The game candles (price action)
 * @param {number} params.finalEquity - Final portfolio value
 * @param {number} params.startingEquity - Starting portfolio value (default 100000)
 * @returns {Promise<string>} AI-generated analysis
 */
const generateTradeAnalysis = async ({ trades, gameCandles, finalEquity, startingEquity = 100000 }) => {
  try {
    const returnPct = ((finalEquity - startingEquity) / startingEquity * 100).toFixed(2);

    // Calculate stock movement
    const startPrice = gameCandles[0]?.open || 0;
    const endPrice = gameCandles[gameCandles.length - 1]?.close || 0;
    const stockReturn = ((endPrice - startPrice) / startPrice * 100).toFixed(2);

    // Summarize trades concisely
    const tradeSummary = trades
      .filter(t => t.action !== 'HOLD')
      .map(t => `W${t.week + 1}:${t.action}@$${t.price?.toFixed(0) || 0}`)
      .join(', ') || 'No trades';

    const prompt = `Trading game result: ${returnPct}% return (stock moved ${stockReturn}%). Trades: ${tradeSummary}. Give a 2-sentence analysis of the trading strategy and result. Be direct and insightful.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a trading coach giving brief post-game feedback. Be concise and insightful.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 150
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating trade analysis:', error);
    if (error.response) console.error('Data:', error.response.data);
    return 'Great game! Review your trades to see what worked and what could be improved.';
  }
};

module.exports = {
  generateTradeAnalysis
};
