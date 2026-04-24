import { generateAiInsightStream } from "../services/ai.service.js";

export const getAiInsights = async (req: any, res: any) => {
  try {
    const { question, dataset } = req.body;

    // Set headers
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const stream = await generateAiInsightStream(dataset, question);

    for await (const chunk of stream) {
      const chunkText = chunk.text || "";

      if (chunkText) {
        res.write(chunkText);
      }
    }

    res.end();
  } catch (error: any) {
    console.error("CONTROLLER ERROR:", error.message);

    if (!res.headersSent) {
      const statusCode = error.status || (error.message.includes("429") ? 429 : 500);
      const message = statusCode === 429 
        ? "Google Gemini API rate limit reached (Free Tier). Please wait a few moments and try again."
        : "AI Service Error. Please try again later.";

      res.status(statusCode).json({ message });
    } else {
      // If streaming already started, we just end the stream
      res.end();
    }
  }
};
