import type { ColumnScore } from "./columnScorer";
import type { StringColumnScore } from "./stringScorer";
import type { DateColumnScore } from "./dateScorer";
import type { CsvDataset } from "../csv/csvTypes";

export interface ChartRecommendation {
  id: string;
  type: "line" | "bar" | "histogram";
  xAx: string;
  yAx: string;
  title: string;
  priority: number;
  color: string;
}

// FAANG-style professional palette
const PALETTE = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
];

export const getRecommendations = (
  numeric: ColumnScore[],
  strings: StringColumnScore[],
  dates: DateColumnScore[],
  dataset: CsvDataset,
): ChartRecommendation[] => {
  const recs: ChartRecommendation[] = [];
  if (numeric.length === 0) return recs;

  const topMetric = numeric[0].column.name;
  const secondaryMetric = numeric[1]?.column.name || topMetric;

  const pushRec = (rec: Omit<ChartRecommendation, "color">) => {
    recs.push({ ...rec, color: PALETTE[recs.length % PALETTE.length] });
  };

  // Line Chart: Trend of top metric over time
  if (dates.length > 0) {
    pushRec({
      id: "trend-1",
      type: "line",
      xAx: dates[0].column.name,
      yAx: topMetric,
      title: `${topMetric} Over Time`,
      priority: 1,
    });
  }

  // Bar Chart: Top metric by category
  if (strings.length > 0) {
    pushRec({
      id: "bar-1",
      type: "bar",
      xAx: strings[0].column.name,
      yAx: topMetric,
      title: `${topMetric} by ${strings[0].column.name}`,
      priority: 2,
    });
  }

  // Bar Chart: Secondary breakdown
  if (strings.length > 1) {
    pushRec({
      id: "bar-2",
      type: "bar",
      xAx: strings[1].column.name,
      yAx: topMetric,
      title: `${topMetric} by ${strings[1].column.name}`,
      priority: 3,
    });
  }

  // Histogram: Distribution of top metric
  pushRec({
    id: "dist-1",
    type: "histogram",
    xAx: topMetric,
    yAx: "",
    title: `${topMetric} Distribution`,
    priority: 4,
  });

  return recs.sort((a, b) => a.priority - b.priority).slice(0, 4);
};
