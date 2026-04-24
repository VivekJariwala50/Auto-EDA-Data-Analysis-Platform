import { GoogleGenAI } from "@google/genai";

export const generateAiInsightStream = async (
  dataset: any,
  question: string,
) => {
  // Support both naming conventions
  const apiKey =
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "No Gemini API key found. Set VITE_GEMINI_API_KEY or GEMINI_API_KEY in backend/.env",
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  // Use a reliable model — skip dynamic discovery which can fail
  const model = "gemini-1.5-flash";

  const colSummary = dataset.columns
    .map((c: any) => `${c.name} (${c.type})`)
    .join(", ");

  const prompt = `
You are an Elite Lead Data Scientist at a top FAANG company, known for delivering actionable, technically rigorous insights.

## Dataset Overview
- **Total Rows:** ${dataset.rowCount.toLocaleString()}
- **Columns (${dataset.columns.length}):** ${colSummary}

## Pre-Calculated Statistics
\`\`\`json
${JSON.stringify(dataset.stats, null, 2)}
\`\`\`

## User Question
"${question}"

## Response Instructions
Answer the user's question with depth and precision. Structure your answer using Markdown:
- Use **bold** for key findings.
- Use bullet points for lists.
- Use ### headings to separate sections when the answer warrants it.
- **Always cite actual numbers from the statistics above** when discussing values.
- Provide context: explain *why* a number matters, not just what it is.
- If relevant, suggest: (1) potential data quality issues, (2) actionable next steps, (3) which ML model type fits this data.
- Do NOT add a greeting or filler. Go straight to the insight.
`;

  // Return a stream
  const result = await ai.models.generateContentStream({
    model,
    contents: prompt,
  });

  return result;
};
