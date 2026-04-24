export type CsvValue = string | number | null;

export type CsvColumnType = "number" | "string" | "date";

export interface CsvColumn {
  name: string;
  type: CsvColumnType;
}

export interface CsvRow {
  [key: string]: CsvValue;
}

export interface CsvDataset {
  rows: CsvRow[];
  columns: CsvColumn[];
  rowCount: number;
}
