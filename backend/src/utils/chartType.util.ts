export const inferChartType = (columns: string[], rows: any[]): string => {
  // 1. Relational Logic
  if (columns.length === 2) {
    // Extract the second column
    const valueColumn = columns[1];

    // Type Guard
    if (valueColumn !== undefined) {
      const values = rows.map((r) => r[valueColumn]);
      const numericCount = values.filter((v) => typeof v === "number").length;

      if (numericCount === values.length && values.length > 0) {
        return "bar";
      }
    }
  }

  // 2. Temporal Logic
  if (columns.some((c) => c.toLowerCase().includes("date"))) {
    return "line";
  }

  // 3. Categorical Logic
  if (columns.length > 0 && columns.length <= 5) {
    return "pie";
  }

  return "table";
};
