import type { CsvColumn, CsvDataset } from "../csv/csvTypes";
import { detectColumnType } from "../csv/detectColumnType";

export interface DateColumnScore {
  column: CsvColumn;
  finalScore: number;
}

export const scoreDateColumns = (dataset: CsvDataset): DateColumnScore[] => {
  return dataset.columns
    .filter((col) => detectColumnType(dataset, col) === "date")
    .map((col) => {
      const validTimestamps = dataset.rows
        .map((r) => r[col.name])
        .filter((v) => v !== null && v !== undefined && v !== "")
        .map((v) => {
          const d = new Date(String(v));

          return isNaN(d.getTime()) ? null : d.getTime();
        })
        .filter((t): t is number => t !== null);

      if (validTimestamps.length === 0) {
        return { column: col, finalScore: 0 };
      }

      const completeness = validTimestamps.length / dataset.rowCount;
      const distinctRatio =
        new Set(validTimestamps).size / validTimestamps.length;

      return {
        column: col,
        finalScore: completeness * 0.5 + distinctRatio * 0.5,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
};
