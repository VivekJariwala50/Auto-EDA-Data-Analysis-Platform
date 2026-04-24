import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Database, Columns, Layers } from "lucide-react";
import { useCsvStore } from "../../store/useCsvStore";
import { scoreNumericColumns } from "../../features/analysis/columnScorer";
import { scoreStringColumns } from "../../features/analysis/stringScorer";
import { scoreDateColumns } from "../../features/analysis/dateScorer";
import { getRecommendations } from "../../features/analysis/recommendationEngine";
import { AIChatDrawer } from "../../components/AIChatDrawer";
import { ThemeToggle } from "../../components/ThemeToggle";
import { DateLineChart } from "../../features/charts/DateLineChart";
import { StringBarChart } from "../../features/charts/StringBarChart";
import { NumericHistogram } from "../../features/charts/NumericHistogram";
import "./Dashboard.css";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Dashboard: React.FC = () => {
  const dataset = useCsvStore((state) => state.dataset);
  const navigate = useNavigate();

  useEffect(() => {
    if (!dataset) navigate("/");
  }, [dataset, navigate]);

  const analysis = useMemo(() => {
    if (!dataset) return null;
    const numeric = scoreNumericColumns(dataset);
    const strings = scoreStringColumns(dataset);
    const dates = scoreDateColumns(dataset);
    return {
      recs: getRecommendations(numeric, strings, dates, dataset),
      stats: { rows: dataset.rowCount, cols: dataset.columns.length },
      types: {
        numeric: dataset.columns.filter((c) => c.type === "number").length,
        string: dataset.columns.filter((c) => c.type === "string").length,
        date: dataset.columns.filter((c) => c.type === "date").length,
      },
    };
  }, [dataset]);

  if (!dataset || !analysis) return null;

  return (
    <div className="dash-root">
      {/* Top bar */}
      <header className="dash-header">
        <div className="dash-header-left">
          <button
            className="btn btn-ghost"
            onClick={() => navigate("/")}
            aria-label="Back to upload"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="dash-title">Data Intelligence</h1>
            <p className="dash-subtitle">
              {analysis.stats.rows.toLocaleString()} rows ·{" "}
              {analysis.stats.cols} columns
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Summary KPIs */}
      <section className="dash-kpi-row">
        <div className="kpi-card">
          <Database size={16} className="kpi-icon" />
          <div>
            <p className="kpi-label">Total Rows</p>
            <p className="kpi-value">{analysis.stats.rows.toLocaleString()}</p>
          </div>
        </div>
        <div className="kpi-card">
          <Columns size={16} className="kpi-icon" />
          <div>
            <p className="kpi-label">Total Columns</p>
            <p className="kpi-value">{analysis.stats.cols}</p>
          </div>
        </div>
        <div className="kpi-card">
          <Layers size={16} className="kpi-icon" />
          <div>
            <p className="kpi-label">Numeric / Text / Date</p>
            <p className="kpi-value">
              {analysis.types.numeric} / {analysis.types.string} /{" "}
              {analysis.types.date}
            </p>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-icon">📈</span>
          <div>
            <p className="kpi-label">Visualisations</p>
            <p className="kpi-value">{analysis.recs.length}</p>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="dash-charts-grid">
        {analysis.recs.map((rec, i) => (
          <motion.div
            key={rec.id}
            className="chart-card"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <div className="chart-card-header">
              <p className="chart-card-title">{rec.title}</p>
            </div>
            <div className="chart-card-body">
              {rec.type === "line" && (
                <DateLineChart
                  {...rec}
                  dateCol={rec.xAx}
                  numericCol={rec.yAx}
                  rows={dataset.rows}
                />
              )}
              {rec.type === "bar" && (
                <StringBarChart
                  {...rec}
                  column={rec.xAx}
                  numericCol={rec.yAx}
                  rows={dataset.rows}
                />
              )}
              {rec.type === "histogram" && (
                <NumericHistogram
                  {...rec}
                  column={rec.xAx}
                  rows={dataset.rows}
                />
              )}
            </div>
          </motion.div>
        ))}
      </section>

      <AIChatDrawer />
    </div>
  );
};

export default Dashboard;
