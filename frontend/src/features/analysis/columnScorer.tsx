import type { CsvDataset, CsvColumn } from "../csv/csvTypes";
import { isLikelyIdentifier } from "./isIdentifier";

export interface ColumnScore {
  column: CsvColumn;
  finalScore: number;
}

export const scoreNumericColumns = (dataset: CsvDataset): ColumnScore[] => {
  return dataset.columns
    .filter((col) => col.type === "number")
    .filter((col) => {
      const values = dataset.rows
        .map((r) => Number(r[col.name]))
        .filter((v) => !isNaN(v));

      return !isLikelyIdentifier(col.name, values, dataset.rowCount);
    })
    .map((col) => {
      const values = dataset.rows
        .map((r) => Number(r[col.name]))
        .filter((v) => !isNaN(v));

      const distinct = new Set(values).size;
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance =
        values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;

      const completeness = values.length / dataset.rowCount;
      const distinctRatio = distinct / values.length;

      // Metric Score
      const varianceScore = Math.min(variance / 1000, 1);
      const metricScore =
        varianceScore * 0.5 + distinctRatio * 0.3 + completeness * 0.2;

      // Final Score
      return { column: col, finalScore: metricScore };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
};
