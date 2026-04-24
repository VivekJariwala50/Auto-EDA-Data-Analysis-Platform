import type { CsvDataset } from "../csv/csvTypes";

const BACKEND_URL =
  (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

// ── Stats calculator ─────────────────────────────────────────────────────────
const calculateStats = (dataset: CsvDataset) => {
  const stats: Record<string, any> = {};

  dataset.columns.forEach((col) => {
    const rawValues = dataset.rows.map((r) => r[col.name]);
    const values = rawValues.filter((v) => v !== null && v !== undefined && v !== "");
    const missing = rawValues.length - values.length;

    if (col.type === "number") {
      const nums = values.map(Number).filter((n) => !isNaN(n));
      if (nums.length === 0) return;

      const n = nums.length;
      const sum = nums.reduce((a, b) => a + b, 0);
      const avg = sum / n;
      const sorted = [...nums].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[n - 1];
      const median = n % 2 === 0
        ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
        : sorted[Math.floor(n / 2)];

      // Variance & std dev
      const variance = nums.reduce((a, b) => a + (b - avg) ** 2, 0) / n;
      const stdDev = Math.sqrt(variance);

      // Skewness (Pearson's second coefficient)
      const skewness = stdDev > 0 ? (3 * (avg - median)) / stdDev : 0;

      // IQR outliers
      const q1 = sorted[Math.floor(n * 0.25)];
      const q3 = sorted[Math.floor(n * 0.75)];
      const iqr = q3 - q1;
      const outlierCount = nums.filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr).length;

      stats[col.name] = {
        type: "numeric",
        count: n,
        missing,
        missingPct: `${((missing / rawValues.length) * 100).toFixed(1)}%`,
        sum: sum.toLocaleString(),
        mean: avg.toFixed(4),
        median: median.toFixed(4),
        stdDev: stdDev.toFixed(4),
        variance: variance.toFixed(4),
        skewness: skewness.toFixed(3),
        min,
        max,
        q1,
        q3,
        iqr: iqr.toFixed(4),
        outlierCount,
        outlierPct: `${((outlierCount / n) * 100).toFixed(1)}%`,
      };
    } else if (col.type === "string") {
      const counts: Record<string, number> = {};
      values.forEach((v) => {
        const k = String(v);
        counts[k] = (counts[k] || 0) + 1;
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const top5 = sorted.slice(0, 5).map(([k, v]) => `${k} (${v})`).join(", ");
      const uniqueCount = sorted.length;

      stats[col.name] = {
        type: "categorical",
        count: values.length,
        missing,
        missingPct: `${((missing / rawValues.length) * 100).toFixed(1)}%`,
        uniqueCount,
        cardinalityRatio: (uniqueCount / values.length).toFixed(3),
        top5Values: top5,
      };
    } else if (col.type === "date") {
      stats[col.name] = {
        type: "date",
        count: values.length,
        missing,
      };
    }
  });

  return stats;
};

// ── Stream function ───────────────────────────────────────────────────────────
export async function streamDataInsights(
  dataset: CsvDataset,
  userQuery: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const stats = calculateStats(dataset);

  const response = await fetch(`${BACKEND_URL}/api/ai/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: userQuery,
      dataset: {
        columns: dataset.columns.map((c) => ({ name: c.name, type: c.type })),
        rowCount: dataset.rowCount,
        stats,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).message || `HTTP ${response.status}`);
  }

  if (!response.body) throw new Error("No response body from server");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}
