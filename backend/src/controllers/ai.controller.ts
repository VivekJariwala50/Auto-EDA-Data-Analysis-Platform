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
      res.status(500).json({
        message: "AI Service Error. Check backend console.",
      });
    } else {
      res.end();
    }
  }
};
