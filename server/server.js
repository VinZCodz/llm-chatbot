import express from 'express';
import cors from 'cors';
import { runLLMClient } from './llmClient.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.post('/v1/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "User chat message can't be empty" });
        }
        console.log(`Received new user message: ${message}`);

        const response = await runLLMClient(message);

        res.status(201).json({ message: response });
    } catch (error) {
        console.error('Error while responding to the user message:', error);
        res.status(500).json({ message: 'Failed to respond!' });
    }
});

app.get('/', (req, res) => {
    res.send('Server started successfully!');
});

app.listen(port, () => {
    console.log(`Server up and running at port: ${port}`)
});