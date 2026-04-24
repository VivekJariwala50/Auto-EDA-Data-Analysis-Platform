import type { FC } from "react";
import { EDAFileUpload } from "../../components/EDAFileUpload";
import { useNavigate } from "react-router-dom";
import { EDAButton } from "../../components/EDAButton";
import ThreeDBackground from "../../components/ThreeDBackground";
import { ThemeToggle } from "../../components/ThemeToggle";
import { motion } from "framer-motion";
import "./Home.css";

const Home: FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ThreeDBackground />
      <ThemeToggle />
      
      <motion.div 
        className="premium-card p-5 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ zIndex: 10, maxWidth: "600px", width: "90%" }}
      >
        <motion.h1 
          className="mb-4 fw-bold" 
          style={{ fontSize: "2.5rem", background: "linear-gradient(to right, var(--primary-color), var(--accent-color))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Auto-EDA Platform
        </motion.h1>
        <p className="text-muted mb-5" style={{ fontSize: "1.1rem" }}>
          Unleash the power of AI to analyze, visualize, and understand your data in seconds. Upload your CSV to get started.
        </p>
        
        <div className="upload-container mb-4">
          <EDAFileUpload className="upload-input" />
        </div>
        
        <EDAButton
          handleClick={() => navigate("/dashboard")}
          className="mt-2 btn-premium w-100"
          title="Generate Insights"
        />
      </motion.div>
    </div>
  );
};

export default Home;
