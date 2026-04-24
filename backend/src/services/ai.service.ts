import { GoogleGenAI } from "@google/genai";

export const generateAiInsightStream = async (
  dataset: any,
  question: string,
) => {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });

  let targetModel = "gemini-1.5-flash"; // Default fallback
  try {
    const models = await ai.models.list();
    // Find the first model
    for await (const m of models) {
      if (m.name && (m.name.includes("flash") || m.name.includes("pro"))) {
        targetModel = m.name.replace("models/", "");
        console.log("Selected Auto-Discovered Model:", targetModel);
        break;
      }
    }
  } catch (e) {
    console.warn("Model discovery failed, using fallback:", targetModel);
  }

  // 2. Prompt
  const prompt = `
    Role: Elite Lead Data Scientist at a FAANG company.
    Task: Answer the user's question with profound, actionable insights using the provided Dataset Statistics.
    
    DATASET CONTEXT:
    - Rows: ${dataset.rowCount}
    - Columns: ${dataset.columns.map((c: any) => c.name).join(", ")}
    
    *** PRE-CALCULATED STATISTICS ***
    ${JSON.stringify(dataset.stats, null, 2)}
    
    User Question: "${question}"
    
    Guidelines for your response:
    1. Provide advanced statistical insights (correlations, variance, distributions, outliers) if relevant.
    2. Suggest actionable business decisions or machine learning models that could be built using this data.
    3. Use professional, beautiful formatting: Markdown with clear headings (###), bullet points, and bold text for emphasis.
    4. Provide hypothesis and identify data quality issues (e.g. skewness, missing values inferred from stats).
    5. Do not just repeat numbers; explain what they mean in a real-world context.
    6. Answer immediately and concisely, do not write "Hello".
  `;

  // 3. Stream Response
  try {
    const result = await ai.models.generateContentStream({
      model: targetModel,
      contents: prompt,
    });
    return result;
  } catch (error: any) {
    console.warn("Primary model failed, trying gemini-pro...");
    const result = await ai.models.generateContentStream({
      model: "gemini-pro",
      contents: prompt,
    });
    return result;
  }
};
