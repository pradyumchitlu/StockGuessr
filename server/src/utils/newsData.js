const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate news for scenario using OpenAI
 * Creates historically accurate but anonymized headlines
 */
const generateNewsHeadlines = async (ticker, gameCandles, startDate) => {
    try {
        const start = new Date(startDate);
        const end = new Date(gameCandles[gameCandles.length - 1].date);

        // Format date range for context (e.g. "September 2008")
        const dateContext = `${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} to ${end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

        // Calculate weekly price changes for context
        const weeklyChanges = [];
        for (let week = 0; week < 4; week++) { // 4 weeks of gameplay
            const weekStart = week * 5;
            // Ensure we don't go out of bounds
            const weekEndIndex = Math.min(weekStart + 4, gameCandles.length - 1);

            if (weekStart < gameCandles.length) {
                const openPrice = gameCandles[weekStart].open;
                const closePrice = gameCandles[weekEndIndex].close;
                const change = ((closePrice - openPrice) / openPrice) * 100;
                weeklyChanges.push({
                    week: week + 1,
                    change: change.toFixed(2),
                    direction: change >= 0 ? 'risen' : 'fallen',
                    volatility: Math.abs(change) > 5 ? 'high' : 'normal'
                });
            }
        }

        const prompt = `You are a financial news simulatior for a trading game.
Target Date Range: ${dateContext}
Stock Price Mvoement:
${weeklyChanges.map(w => `Week ${w.week}: Market value has ${w.direction} by ${w.change}% (${w.volatility} volatility)`).join('\n')}

Task: Generate 8 financial news headlines (2 per week) that match the historical context of ${dateContext} and the specific price movement described.
Rules:
1. ANONYMIZE the specific company. Use terms like "The Company", "This Tech Giant", "The Banking Firm", or "Shares" instead of the name/ticker.
2. References to REAL MACRO EVENTS (e.g. "Housing Crisis", "Dot-com bursting", "Covid-19", "Inflation fears") are ENCOURAGED if they happened during ${dateContext}.
3. The headlines must explain/correlate with the price movement (e.g. if price fell 10%, headline should imply bad news).
4. Tone: Professional financial journalism (Bloomberg/WSJ style).

Return ONLY a JSON array in this format:
[
  {"week": 1, "headline": "Sector hit by housing crisis fears, dragging down major lenders"},
  {"week": 1, "headline": "The Company reports earnings miss amid broader sell-off"},
  ...
]`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a financial news generator. Return only valid JSON.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        const content = response.choices[0].message.content.trim();
        let jsonStr = content;
        // Strip markdown if present
        if (content.includes('```')) {
            jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        }

        const headlines = JSON.parse(jsonStr);

        // Add timestamps to headlines to make them usable by frontend
        const news = headlines.map(h => {
            const headlineDate = new Date(start);
            // Random day within the specific week
            const dayOffset = ((h.week - 1) * 7) + Math.floor(Math.random() * 5);
            headlineDate.setDate(headlineDate.getDate() + dayOffset);

            return {
                week: h.week,
                headline: h.headline,
                date: headlineDate,
                source: 'Market Wire' // Generic source
            };
        });

        return news;

    } catch (error) {
        console.error('Error in AI news generation:', error.message);
        return generateEmergencyFallback(startDate);
    }
};

/**
 * Emergency fallback if OpenAI fails entirely
 */
const generateEmergencyFallback = (startDate) => {
    const templates = [
        'Trading volume surges as investors reassess positions',
        'Sector volatility creates new opportunities for traders',
        'Market analysts debate impact of recent economic data',
        'Company shares react to broader market sentiment',
        'Institutional investors adjust portfolios amid uncertainty',
        'Technical indicators suggest potential trend reversal',
        'Quarterly expectations drive late-week trading action',
        'Global markets show mixed reactions to central bank signals'
    ];

    const news = [];
    for (let i = 0; i < 4; i++) { // 4 weeks
        // 2 headlines per week
        for (let j = 0; j < 2; j++) {
            const headlineDate = new Date(startDate);
            headlineDate.setDate(headlineDate.getDate() + (i * 7) + (j * 3));
            news.push({
                week: i + 1,
                headline: templates[(i * 2 + j) % templates.length],
                date: headlineDate,
                source: 'Market Wire'
            });
        }
    }
    return news;
};

module.exports = {
    generateNewsHeadlines
};

