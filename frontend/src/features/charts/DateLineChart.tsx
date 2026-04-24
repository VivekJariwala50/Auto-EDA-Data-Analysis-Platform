import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
);

export function DateLineChart({
  dateCol,
  numericCol,
  rows,
  color = "#22c55e",
}: {
  dateCol: string;
  numericCol: string;
  rows: any[];
  color?: string;
}) {
  const map = new Map<string, number[]>();

  rows.forEach((r) => {
    const rawDate = r[dateCol];
    const val = +r[numericCol];

    if (!rawDate || isNaN(val)) return;

    // Parse the date
    const dateObj = new Date(rawDate);

    // Check if valid date
    if (isNaN(dateObj.getTime())) return;

    // Normalize to YYYY-MM-DD
    const key = dateObj.toISOString().split("T")[0];

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(val);
  });

  // Sort keys
  const labels = Array.from(map.keys()).sort();

  // Calculate average for each day
  const values = labels.map(
    (dateKey) =>
      map.get(dateKey)!.reduce((a, b) => a + b, 0) / map.get(dateKey)!.length,
  );

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: numericCol,
            data: values,
            borderColor: "#22c55e",
            tension: 0.3,
            pointRadius: 2,
            backgroundColor: `${color}33`,
          },
        ],
      }}
      options={{
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "PP",
            },
            title: {
              display: true,
              text: dateCol,
            },
          },
          y: {
            title: {
              display: true,
              text: numericCol,
            },
          },
        },
      }}
    />
  );
}
