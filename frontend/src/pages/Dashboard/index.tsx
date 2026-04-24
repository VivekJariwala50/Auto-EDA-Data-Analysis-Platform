import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCsvStore } from "../../store/useCsvStore";
import { scoreNumericColumns } from "../../features/analysis/columnScorer";
import { scoreStringColumns } from "../../features/analysis/stringScorer";
import { scoreDateColumns } from "../../features/analysis/dateScorer";
import { getRecommendations } from "../../features/analysis/recommendationEngine";
import CustomCard from "../../components/CustomCard";
import { AIChatDrawer } from "../../components/AIChatDrawer";
import { ThemeToggle } from "../../components/ThemeToggle";
import { motion } from "framer-motion";

// Chart Components
import { DateLineChart } from "../../features/charts/DateLineChart";
import { StringBarChart } from "../../features/charts/StringBarChart";
import { NumericHistogram } from "../../features/charts/NumericHistogram";

const Dashboard: React.FC = () => {
  const dataset = useCsvStore((state) => state.dataset);
  const navigate = useNavigate();

  useEffect(() => {
    if (!dataset) {
      navigate("/");
    }
  }, [dataset, navigate]);

  const analysis = useMemo(() => {
    if (!dataset) return null;

    const numeric = scoreNumericColumns(dataset);
    const strings = scoreStringColumns(dataset);
    const dates = scoreDateColumns(dataset);

    return {
      recs: getRecommendations(numeric, strings, dates, dataset),
      stats: { rows: dataset.rowCount, cols: dataset.columns.length },
    };
  }, [dataset]);

  if (!dataset || !analysis) return null;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <header className="mb-5 d-flex justify-content-between align-items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="fw-bold display-6" style={{ background: "linear-gradient(to right, var(--primary-color), var(--accent-color))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Data Intelligence
            </h1>
            <p className="text-muted mb-0">
              Analyzing {analysis.stats.rows.toLocaleString()} records across{" "}
              {analysis.stats.cols} columns
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <button
              className="btn-premium"
              onClick={() => navigate("/")}
            >
              Upload New File
            </button>
            <ThemeToggle />
          </motion.div>
        </header>

        <motion.div 
          className="row row-cols-1 row-cols-md-2 g-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {analysis.recs.map((rec, i) => (
            <motion.div 
              className="col" 
              key={rec.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <CustomCard
                title={rec.title}
                className="h-100 premium-card"
              >
                <div style={{ height: "350px" }}>
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
              </CustomCard>
            </motion.div>
          ))}
        </motion.div>
        <AIChatDrawer />
      </div>
    </div>
  );
};

export default Dashboard;
