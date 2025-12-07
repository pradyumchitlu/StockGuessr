const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate news for scenario using OpenAI
 * Creates historically accurate but anonymized headlines
 */
const generateNewsHeadlines = async (ticker, gameCandles, startDate, companyName = '') => {
    try {
        const start = new Date(startDate);
        const end = new Date(gameCandles[gameCandles.length - 1].date);

        // Core name for regex (strip Inc, Corp, etc)
        const coreName = companyName
            .replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|Co\.?|PLC|S\.A\.|NV)\.?$/i, '')
            .trim();

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

        const prompt = `You are a financial news generator for a stock trading game.

CONTEXT:
- Company: ${companyName} (${ticker}) - a real company
- Date Range: ${dateContext}
- This is REAL historical data. Research what actually happened to this company during this time.

STOCK PRICE MOVEMENT (what actually happened):
${weeklyChanges.map(w => `Week ${w.week}: Stock ${w.direction} by ${w.change}% (${w.volatility} volatility)`).join('\n')}

YOUR TASK:
Generate 8 news headlines (2 per week) that reflect REAL events that happened to ${companyName} during ${dateContext}.

CRITICAL RULES:
1. Headlines must be SPECIFIC to what actually happened to ${companyName} during this period (product launches, earnings, acquisitions, lawsuits, executive changes, etc.)
2. Headlines must CORRELATE with the price movement (if price fell 10%, headline should explain why - bad earnings, scandal, etc.)
3. ANONYMIZE the company name: Replace "${coreName}" and "${ticker}" with "The Company" or "This Tech Giant" or similar generic term
4. Include real macro events if relevant (COVID, inflation, Fed rates, etc.)
5. Professional financial journalism tone (Bloomberg/WSJ style)

EXAMPLE OUTPUT:
If Apple stock rose 15% in March 2020:
- "The Company sees surge in demand as remote work drives device sales"
- "Tech giant beats Q1 estimates, raises guidance for services segment"

Return ONLY a valid JSON array:
[
  {"week": 1, "headline": "..."},
  {"week": 1, "headline": "..."},
  {"week": 2, "headline": "..."},
  ...
]`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a financial news generator. Research what actually happened to the given company during the specified time period and generate realistic headlines. Return only valid JSON.' },
                { role: 'user', content: prompt }
            ],
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

            // Strict anonymization: Remove ticker and common variations
            let cleanHeadline = h.headline
                .replace(new RegExp(`\\b${ticker}\\b`, 'gi'), 'The Company')
                .replace(new RegExp(`\\b${ticker.toLowerCase()}\\b`, 'g'), 'the company');

            if (coreName && coreName.length > 2) { // Avoid replacing short common words
                // Also handle possessive forms and variations
                cleanHeadline = cleanHeadline
                    .replace(new RegExp(`\\b${coreName}'s\\b`, 'gi'), "The Company's")
                    .replace(new RegExp(`\\b${coreName}\\b`, 'gi'), 'The Company');
            }

            return {
                week: h.week,
                headline: cleanHeadline,
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

