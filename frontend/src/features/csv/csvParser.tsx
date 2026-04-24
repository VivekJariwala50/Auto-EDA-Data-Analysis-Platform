import Papa from "papaparse";
import type { CsvDataset, CsvColumn } from "./csvTypes";
import { inferColumnType } from "./csvUtils";

export const parseCsvFile = (file: File): Promise<CsvDataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (results) => {
        const rawRows = results.data;
        const fields = results.meta.fields ?? [];

        const columns: CsvColumn[] = fields.map((field) => ({
          name: field,
          type: inferColumnType(rawRows.map((row) => row[field])),
        }));

        resolve({
          rows: rawRows,
          columns,
          rowCount: rawRows.length,
        });
      },
      error: reject,
    });
  });
};
