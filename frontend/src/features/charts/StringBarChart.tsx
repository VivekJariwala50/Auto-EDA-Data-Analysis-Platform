import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StringBarChartProps {
  column: string;
  numericCol: string;
  rows: any[];
  color?: string;
}

export function StringBarChart({
  column,
  numericCol,
  rows,
  color = "#6366f1",
}: StringBarChartProps) {
  const totals: Record<string, number> = {};

  rows.forEach((r) => {
    const key = r[column];
    const val = parseFloat(r[numericCol]);
    if (!key || isNaN(val)) return;
    totals[key] = (totals[key] || 0) + val;
  });

  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (sorted.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted bg-light rounded">
        <p className="small mb-0">
          No valid relational data found for these columns.
        </p>
      </div>
    );
  }

  return (
    <Bar
      data={{
        labels: sorted.map((d) => d[0]),
        datasets: [
          {
            label: numericCol,
            data: sorted.map((d) => d[1]),
            backgroundColor: color,
            borderRadius: 8,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      }}
    />
  );
}
