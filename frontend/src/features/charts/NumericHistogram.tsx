import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

export function NumericHistogram({
  column,
  rows,
}: {
  column: string;
  rows: any[];
}) {
  const values = rows.map((r) => +r[column]).filter((v) => !isNaN(v));

  const bins = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / bins;

  const counts = Array(bins).fill(0);
  values.forEach((v) => {
    const idx = Math.min(Math.floor((v - min) / step), bins - 1);
    counts[idx]++;
  });

  const labels = counts.map((_, i) => `${(min + i * step).toFixed(0)}`);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: column,
            data: counts,
            backgroundColor: "#4f46e5",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: column,
            },
          },
          y: {
            title: {
              display: true,
              text: "Count",
            },
          },
        },
      }}
    />
  );
}
