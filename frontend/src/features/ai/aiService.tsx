import type { CsvDataset } from "../csv/csvTypes";

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const calculateStats = (dataset: CsvDataset) => {
  const stats: any = {};

  dataset.columns.forEach((col) => {
    // Get valid values for this column
    const values = dataset.rows
      .map((r) => r[col.name])
      .filter((v) => v !== null && v !== undefined && v !== "");

    if (col.type === "number") {
      const nums = values.map((v) => Number(v)).filter((n) => !isNaN(n));
      if (nums.length > 0) {
        const sum = nums.reduce((a, b) => a + b, 0);
        const avg = sum / nums.length;
        const min = Math.min(...nums);
        const max = Math.max(...nums);
        stats[col.name] = {
          Total: sum.toLocaleString(),
          Average: avg.toFixed(2),
          Min: min,
          Max: max,
        };
      }
    } else {
      // Find most common text values
      const counts: Record<string, number> = {};
      values.forEach((v) => {
        const val = String(v);
        counts[val] = (counts[val] || 0) + 1;
      });
      // Sort to find top 3
      const top3 = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k, v]) => `${k} (${v})`)
        .join(", ");

      stats[col.name] = {
        MostCommon: top3,
        UniqueCount: Object.keys(counts).length,
      };
    }
  });
  return stats;
};

export async function streamDataInsights(
  dataset: CsvDataset,
  userQuery: string,
  onChunk: (chunk: string) => void,
): Promise<void> {
  // Calculate stats
  const calculatedStats = calculateStats(dataset);

  const response = await fetch(`${BACKEND_URL}/api/ai/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: userQuery,
      dataset: {
        columns: dataset.columns.map((c) => ({ name: c.name, type: c.type })),
        rowCount: dataset.rowCount,
        stats: calculatedStats,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "AI Request Failed");
  }

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
}
