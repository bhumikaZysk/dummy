import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const { description } = req.body;

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    // Make the request to OpenAI
    const response = await openai.createCompletion({
      model: 'gpt-4o-mini',
      prompt: description,
      max_tokens: 1500,
      temperature: 0.1,
    });

    // Log the raw text response from OpenAI for debugging purposes
    const textResponse = response.data.choices[0].text.trim();
    console.log('Raw response from OpenAI:', textResponse);
    
    // Parse the JSON from the OpenAI response
    const generatedQuestions = JSON.parse(textResponse);

    // Return the parsed JSON as the response
    res.status(200).json(generatedQuestions);
  } catch (error) {
    // Log any errors that occur during the API call or JSON parsing
    console.error('Error generating questions:', error.message);

    // Send a 500 error response if something goes wrong
    res.status(500).json({ error: 'Failed to generate questions' });
  }
}
