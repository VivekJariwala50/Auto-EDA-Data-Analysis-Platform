import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles, RotateCcw, Send, Lightbulb } from "lucide-react";
import { useCsvStore } from "../../store/useCsvStore";
import { streamDataInsights } from "../../features/ai/aiService";
import "./AIChatDrawer.css";

interface Message {
  role: "user" | "ai";
  text: string;
}

const SUGGESTION_TEMPLATES = [
  (num: string) => `What is the distribution of ${num}?`,
  (num: string) => `Identify outliers in ${num} and explain their impact.`,
  (_: string, str: string) => `What are the top values in ${str}?`,
  (num: string) => `What business insights can I draw from ${num}?`,
  () => "Summarize the key trends and anomalies in this dataset.",
  () => "What machine learning models could be built on this data?",
  () => "Are there any data quality issues I should address?",
];

export const AIChatDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const dataset = useCsvStore((s) => s.dataset);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!dataset) return [];
    const num = dataset.columns.find((c) => c.type === "number")?.name ?? "";
    const str = dataset.columns.find((c) => c.type === "string")?.name ?? "";
    return SUGGESTION_TEMPLATES.map((fn) => fn(num, str))
      .filter((s) => !s.includes("undefined") && !s.includes("?undefined"))
      .slice(0, 6);
  }, [dataset]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (question: string) => {
    const q = question.trim();
    if (!q || loading || !dataset) return;
    setMessages((p) => [...p, { role: "user", text: q }]);
    setMessages((p) => [...p, { role: "ai", text: "" }]);
    setLoading(true);

    try {
      await streamDataInsights(dataset, q, (chunk) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, text: last.text + chunk };
          return next;
        });
      });
    } catch (error: any) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1].text = `⚠️ ${error.message || "Could not reach AI service."}`;
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
  };

  return (
    <>
      {/* FAB */}
      <button
        className="ai-fab"
        onClick={() => setOpen(true)}
        aria-label="Open AI Analyst"
      >
        <Bot size={22} />
        <span className="ai-fab-label">AI Analyst</span>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="ai-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="ai-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 35 }}
          >
            {/* Header */}
            <div className="ai-drawer-header">
              <div className="ai-drawer-title-row">
                <div className="ai-drawer-icon">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="ai-drawer-title">AI Data Scientist</span>
                  <span className="ai-drawer-model">gemini-2.5-flash</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {messages.length > 0 && (
                  <button
                    className="btn btn-ghost ai-reset-btn"
                    onClick={handleReset}
                    title="Clear conversation"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
                <button className="btn btn-ghost" onClick={() => setOpen(false)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="ai-messages">
              {messages.length === 0 && (
                <div className="ai-empty-state">
                  <div className="ai-empty-icon">
                    <Bot size={28} />
                  </div>
                  <p className="ai-empty-title">AI Data Scientist</p>
                  <p className="ai-empty-desc">
                    Ask anything — distributions, outliers, trends, correlations,
                    or ML recommendations. Use a suggestion or type your own.
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`ai-message ${m.role === "user" ? "ai-message-user" : "ai-message-ai"}`}
                >
                  {m.role === "ai" && m.text === "" && loading ? (
                    <div className="ai-typing">
                      <span /><span /><span />
                    </div>
                  ) : (
                    <p className="ai-message-text">{m.text}</p>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions — Permanent at bottom */}
            {suggestions.length > 0 && (
              <div className="ai-suggestions-bottom">
                <div className="ai-suggestions-header">
                  <Lightbulb size={13} />
                  <span>Choose a prompt</span>
                </div>
                <div className="ai-suggestions-list">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="ai-suggestion-chip"
                      onClick={() => sendMessage(s)}
                      disabled={loading}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
