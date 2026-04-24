import type { CsvColumn } from "../csv/csvTypes";

type ChartType =
  | "line"
  | "multi-line"
  | "bar"
  | "horizontal-bar"
  | "scatter"
  | "kpi"
  | "table";

export function autoSelectChart({
  numeric,
  strings,
  dates,
}: {
  numeric: CsvColumn[];
  strings: CsvColumn[];
  dates: CsvColumn[];
}): ChartType {
  const n = numeric.length;
  const s = strings.length;
  const d = dates.length;

  if (d >= 1 && n >= 1) {
    return n > 1 ? "multi-line" : "line";
  }

  if (s >= 1 && n >= 1) {
    return "bar";
  }

  if (n >= 2 && s === 0 && d === 0) {
    return "scatter";
  }

  if (n === 1) {
    return "kpi";
  }

  return "table";
}
