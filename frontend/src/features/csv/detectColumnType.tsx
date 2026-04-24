import type { CsvDataset, CsvColumn } from "./csvTypes";

export type ColumnType = "number" | "string" | "date";

export const detectColumnType = (
  dataset: CsvDataset,
  col: CsvColumn,
): ColumnType => {
  const values = dataset.rows
    .map((r) => r[col.name])
    .filter(
      (v): v is string | number => v !== null && v !== undefined && v !== "",
    );

  // check number
  const numberCount = values.filter((v) => !isNaN(Number(v))).length;
  if (numberCount / values.length > 0.8) return "number";

  // check date
  const dateCount = values.filter(
    (v) => !isNaN(Date.parse(v.toString())),
  ).length;
  if (dateCount / values.length > 0.8) return "date";

  return "string";
};
