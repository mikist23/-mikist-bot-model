import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello, we are about to start!',
  });
});


app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt.toLowerCase();

    if (prompt.includes('who created you')) {
      return res.status(200).send({
        bot: 'I was created by Mike Ochango Absai  a senior developer',
      });
    } else if (prompt.includes('tell me more about Mike','who is  Mike')) {
      return res.status(200).send({
        bot: 'Absai Mike Ochango, a passionate and dedicated IT professional with a strong problem-solving mindset and a drive to learn and apply new technologies. He thrive in collaborative team environments, where my detail-oriented and organized approach helps me deliver exceptional results.Feel free to explore my portfolio to see examples of my projects and the outcomes I have achieved. ',
      });
        
    }
    else if(prompt.includes('who is  Mike')){
      return res.status(200).send({bot:''})

    }

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

    });

    res.status(200).send({
      bot: response.data.choices[0].text.trim(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Something went wrong');
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
