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
  color = "rgba(37, 99, 235, 0.75)",
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        No valid data for these columns.
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
        scales: {
          x: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.05)" } },
          y: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.05)" } },
        },
      }}
    />
  );
}
