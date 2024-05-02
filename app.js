/* Sử dụng Npm OpenAI */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* 
curl -X POST http://localhost:3000/ask \
-H "Content-Type: application/json" \
-d '{"question":"What is the capital of France?"}'


*/
app.post('/ask', async (req, res) => {
    
  const question = req.body.question;
  console.log("====P START QUESTION : " + question)

  if (!question) {
    return res.status(400).json({ error: 'No question provided' });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: question }],
        model: 'gpt-3.5-turbo',
      });

    // console.log(chatCompletion)
    
    const answerStr = JSON.stringify(chatCompletion.choices[0].message);
    console.log(answerStr)
    /*  data answer là jsontring : {"answer":{"role":"assistant","content":"The capital of France is Paris."}} */
    /* Convert jsonstring to json and get content */
    
    const answer = JSON.parse(answerStr).content;
    console.log("= Answer : " + answer)
    console.log("\t \n")
    res.json({ answer });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error processing your question', details: error.message });
  }
});


/* 
curl -G 'http://localhost:3000/ask' --data-urlencode "question=What is the capital of France?"
*/
app.get('/ask', async (req, res) => {
    
    const question = req.query.question;
    console.log("====G START QUESTION : " + question)
  
    if (!question) {
      return res.status(400).json({ error: 'No question provided' });
    }
  
    try {
      const chatCompletion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: question }],
          model: 'gpt-3.5-turbo',
        });
  
      // console.log(chatCompletion)
      
      const answerStr = JSON.stringify(chatCompletion.choices[0].message);
      console.log(answerStr)
      /*  data answer là jsontring : {"answer":{"role":"assistant","content":"The capital of France is Paris."}} */
      /* Convert jsonstring to json and get content */
      
      const answer = JSON.parse(answerStr).content;
      console.log("= Answer : " + answer)
      console.log("\t \n")
      res.json({ answer });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).json({ error: 'Error processing your question', details: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
