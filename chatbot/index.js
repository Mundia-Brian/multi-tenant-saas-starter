// Chatbot Service - OpenAI-Powered (Multi-Tenant Ready)
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());

app.use((req, res, next) => {
  const hostname = req.hostname;
  req.tenantId = hostname.split('.')[0];
  next();
});

app.post('/api/chat', async (req, res) => {
  const { message, context = [] } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `You are a helpful assistant for tenant ${req.tenantId}` },
        ...context,
        { role: 'user', content: message },
      ],
    });
    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.listen(PORT, () => console.log(`Chatbot service running on port ${PORT}`));
