const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const analyzeTradePerformance = async (
  playerTrades,
  stockTicker,
  stockDate,
  candles,
  news,
  finalEquity
) => {
  try {
    const candleData = candles
      .map(
        c =>
          `${c.date.toISOString().split('T')[0]}: O=${c.open}, H=${c.high}, L=${c.low}, C=${c.close}, V=${c.volume}`
      )
      .join('\n');

    const newsData = news
      .map(n => `Week ${n.week}: ${n.headline}`)
      .join('\n');

    const tradesData = playerTrades
      .map(
        t =>
          `Week ${t.week}: ${t.action} at $${t.price} (${t.shares} shares) - PnL: $${t.pnl}`
      )
      .join('\n');

    const prompt = `You are a professional stock market analyst. Analyze the following trading performance:

Stock: ${stockTicker}
Period: ${stockDate.toISOString().split('T')[0]}
Final Portfolio Value: $${finalEquity}

Historical Price Data:
${candleData}

Market News:
${newsData}

Player Trades:
${tradesData}

Provide a concise (3-4 sentences) analysis that includes:
1. What the player did well
2. What they missed or could improve
3. One key insight from the data

Keep it friendly and encouraging, like a coach's feedback.`;

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return message.content[0].text;
  } catch (error) {
    console.error('AI Analysis error:', error);
    return 'Great effort! You traded strategically during this market period. Keep analyzing news catalysts and price action to improve your entries and exits.';
  }
};

module.exports = {
  analyzeTradePerformance,
};
