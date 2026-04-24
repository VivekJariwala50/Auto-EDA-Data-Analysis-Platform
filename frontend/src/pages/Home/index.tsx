import type { FC } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EDAFileUpload } from "../../components/EDAFileUpload";
import ThreeDBackground from "../../components/ThreeDBackground";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useTheme } from "../../store/ThemeContext";
import { useCsvStore } from "../../store/useCsvStore";
import "./Home.css";

const FEATURES = [
  { icon: "📊", label: "Auto-Visualise", desc: "Charts generated instantly" },
  { icon: "🤖", label: "AI Insights", desc: "Expert-level analysis" },
  { icon: "⚡", label: "Web Workers", desc: "Handles 1M+ rows" },
];

const Home: FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dataset = useCsvStore((s) => s.dataset);

  return (
    <div className="home-root">
      <ThreeDBackground dark={theme === "dark"} />

      {/* Navbar */}
      <nav className="home-nav">
        <span className="home-logo">
          <Zap size={18} strokeWidth={2.5} style={{ color: "var(--brand)" }} />
          Auto-EDA
        </span>
        <ThemeToggle />
      </nav>

      {/* Hero */}
      <main className="home-hero">
        <motion.div
          className="home-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div className="home-badge">
            <span className="badge badge-brand">✦ AI-Powered EDA Platform</span>
          </div>

          <h1 className="home-title">
            Turn raw data into
            <br />
            <span className="home-gradient">expert insights</span>
          </h1>

          <p className="home-subtitle">
            Upload any CSV file. Get beautiful charts, statistical analysis, and
            AI-driven recommendations in seconds — no code required.
          </p>

          {/* Upload zone */}
          <div className="home-upload-zone">
            <EDAFileUpload />
          </div>

          {/* CTA */}
          {dataset && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="btn btn-primary btn-lg home-cta"
                onClick={() => navigate("/dashboard")}
              >
                <UploadCloud size={18} />
                Analyse Dataset
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {/* Feature pills */}
          <div className="home-features">
            {FEATURES.map((f) => (
              <div key={f.label} className="home-feature-pill">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <p className="feature-label">{f.label}</p>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
