import type { CsvColumnType } from "./csvTypes";

export const inferColumnType = (values: string[]): CsvColumnType => {
  const sample = values.filter(Boolean).slice(0, 20);

  if (sample.length === 0) return "string";

  if (sample.every((v) => !isNaN(Number(v)))) {
    return "number";
  }

  if (sample.every((v) => !isNaN(Date.parse(v)))) {
    return "date";
  }

  return "string";
};
