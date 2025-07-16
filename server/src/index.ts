import express, { Request, Response, Router } from 'express';
import { generatImageDescription } from "./helper/helper";
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';
import cors from 'cors';
// import { main } from './helper/RAGPrac';
dotenv.config();

const app = express();
const router = Router();
const port = 5000;

// Enable CORS for all routes i.e., allowing requests from any domain or origin
app.use(cors({ origin: '*' }));

// Parse JSON bodies
app.use(express.json({limit: '50mb'}));

// Mount the router on the Express app
app.use('/api', router);


router.post('/completion', async (req: Request, res: Response) => {
  console.log('Request body:', req.body);
  const messages = req.body.messages || [
    {role: 'user', content: req.body.prompt}
  ];

  try {
    console.log('Calling generateText with messages:', messages);
    const {response} = await generateText({
      model: google('gemini-1.5-pro'),
      system: 'You are a helpful assistant who praises the user. Please give answers in 2 lines',
      messages: messages,
    });
    
    // Extract text content similar to image upload
    const message = response?.messages?.[0];
    if (message && message.content) {
      res.json({ text: message.content });
    } else {
      res.status(400).json({ error: 'No content found' });
    }
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/generate-image-description', async(req: Request, res: Response) => {
  try {
    const { image } = req.body;
    const result = await generatImageDescription(image);
    const message = result?.messages?.[0];
    if (message && message.content) {
      console.log(message.content);
      res.json({ text: message.content });
    } else {
      res.status(400).json({ error: 'No content found' });
    }
  } catch (error) {
    console.error('Error generating image description:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

console.log("GOOGLE_GENERATIVE_AI_API_KEY:", process.env.GOOGLE_GENERATIVE_AI_API_KEY);
// main()
//   .then()
//   .catch(error => console.error('Error in RAG processing:', error));