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

const CHART_COLORS = {
  bar: "rgba(37, 99, 235, 0.75)",
  barHover: "rgba(37, 99, 235, 1)",
  gridLine: "rgba(0,0,0,0.06)",
  tick: "#6b7280",
};

export function NumericHistogram({
  column,
  rows,
}: {
  column: string;
  rows: any[];
}) {
  const values = rows.map((r) => +r[column]).filter((v) => !isNaN(v));
  const bins = Math.min(20, Math.ceil(Math.sqrt(values.length)));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / bins || 1;

  const counts = Array(bins).fill(0);
  values.forEach((v) => {
    const idx = Math.min(Math.floor((v - min) / step), bins - 1);
    counts[idx]++;
  });

  const labels = counts.map((_, i) =>
    (min + i * step).toLocaleString(undefined, { maximumFractionDigits: 2 })
  );

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: column,
            data: counts,
            backgroundColor: CHART_COLORS.bar,
            hoverBackgroundColor: CHART_COLORS.barHover,
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: CHART_COLORS.gridLine },
            ticks: { color: CHART_COLORS.tick, font: { size: 11 }, maxTicksLimit: 8 },
          },
          y: {
            grid: { color: CHART_COLORS.gridLine },
            ticks: { color: CHART_COLORS.tick, font: { size: 11 } },
          },
        },
      }}
    />
  );
}
