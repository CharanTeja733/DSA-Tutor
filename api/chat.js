  import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Check for POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Get API Key from Environment Variables (Secure)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured on server' });
  }

  try {
    const { message } = req.body;

    // 3. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash", // Or "gemini-2.0-flash" if available to you
        systemInstruction: `you are an Data Structure and Algorithms instructor who is going to answer Data Structure and Algorithms questions in a easy to undersand format and under 3 to 4 lines. if the questions are not related to Data Structure and Algorithms, you need to reply rudely that you only answer Data Structure and Algorithms questions like that you the reply according to the question`
    });

    // 4. Generate Content (Stateless - No History passed as requested)
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // 5. Send result back to frontend
    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}