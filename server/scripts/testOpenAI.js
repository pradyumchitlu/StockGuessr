// Test OpenAI API with gpt-5-nano
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function testAI() {
    console.log('Testing OpenAI API...');
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 7));

    try {
        console.log('Calling gpt-5-nano...');
        const response = await openai.chat.completions.create({
            model: 'gpt-5-nano',
            messages: [
                { role: 'user', content: 'Say hello in 5 words or less' }
            ],
            max_completion_tokens: 50
        });

        console.log('SUCCESS!');
        console.log('Response:', response.choices[0].message.content);
    } catch (error) {
        console.log('ERROR!');
        console.log('Error type:', error.constructor.name);
        console.log('Error message:', error.message);
        if (error.code) console.log('Error code:', error.code);
        if (error.status) console.log('HTTP status:', error.status);
    }
}

testAI();
