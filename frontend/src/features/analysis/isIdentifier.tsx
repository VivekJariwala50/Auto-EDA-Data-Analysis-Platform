export const isLikelyIdentifier = (
  columnName: string,
  values: number[],
  rowCount: number,
): boolean => {
  if (values.length === 0) return false;

  const name = columnName.toLowerCase();

  // Name
  const nameScore = /(id|number|line|code|index)/i.test(name) ? 0.5 : 0;

  // Distinctness
  const distinctCount = new Set(values).size;
  const distinctRatio = distinctCount / values.length;
  const distinctScore = distinctRatio > 0.95 ? 0.5 : 0;

  // Sequential check
  const sorted = [...values].sort((a, b) => a - b);
  let sequentialCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) sequentialCount++;
  }
  const sequentialRatio = sequentialCount / values.length;
  const sequentialScore = sequentialRatio > 0.9 ? 0.5 : 0;

  // Combine all signals
  const identifierScore = nameScore + distinctScore + sequentialScore;

  // Anything above 0.5 is likely an identifier
  return identifierScore >= 0.5;
};
