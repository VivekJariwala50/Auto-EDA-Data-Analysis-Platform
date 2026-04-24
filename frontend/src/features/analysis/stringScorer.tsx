import type { CsvColumn, CsvDataset } from "../csv/csvTypes";
import { detectColumnType } from "../csv/detectColumnType";

export interface StringColumnScore {
  column: CsvColumn;
  finalScore: number;
}

export const scoreStringColumns = (
  dataset: CsvDataset,
): StringColumnScore[] => {
  return dataset.columns
    .filter((col) => detectColumnType(dataset, col) === "string")
    .map((col) => {
      const values = dataset.rows
        .map((r) => r[col.name])
        .filter(
          (v): v is string | number =>
            v !== null && v !== undefined && v !== "",
        );

      const rowCount = dataset.rowCount;
      const distinct = new Set(values).size;
      const distinctRatio = distinct / values.length;
      const completeness = values.length / rowCount;

      const freqMap = new Map<string | number, number>();
      values.forEach((v) => freqMap.set(v, (freqMap.get(v) || 0) + 1));
      const maxFreq = Math.max(...freqMap.values());
      const freqBalance = 1 - maxFreq / values.length;

      const nameScore = /(name|email|phone|address|id|code)/i.test(col.name)
        ? 0.5
        : 0;
      const identifierPenalty = nameScore + (distinctRatio > 0.95 ? 0.5 : 0);

      const finalScore =
        completeness * 0.3 +
        freqBalance * 0.3 +
        distinctRatio * 0.4 -
        identifierPenalty;

      return { column: col, finalScore: Math.max(finalScore, 0) };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
};
