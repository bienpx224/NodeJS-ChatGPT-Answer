/* Sử dụng Axios */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

app.use(bodyParser.json());

/* Sử dụng Axios */

/* 
curl -X POST http://localhost:3000/ask \
-H "Content-Type: application/json" \
-d '{"question":"What is the capital of France?"}'

*/
app.post('/ask', async (req, res) => {
    const question = req.body.question;

    if (!question) {
        return res.status(400).json({ error: 'No question provided' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const answer = response.data.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Error processing your question' });
    }
});


/* 
curl -G 'http://localhost:3000/ask' --data-urlencode "question=What is the capital of France?"

*/
app.get('/ask', async (req, res) => {
    const question = req.query.question;

    if (!question) {
        return res.status(400).json({ error: 'No question provided' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const answer = response.data.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Error processing your question' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
