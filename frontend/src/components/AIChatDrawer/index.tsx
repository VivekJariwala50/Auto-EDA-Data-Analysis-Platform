import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Sparkles, RotateCcw, Send, ChevronDown } from "lucide-react";
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
];

export const AIChatDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const dataset = useCsvStore((s) => s.dataset);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    if (!dataset) return [];
    const num = dataset.columns.find((c) => c.type === "number")?.name ?? "";
    const str = dataset.columns.find((c) => c.type === "string")?.name ?? "";
    return SUGGESTION_TEMPLATES.map((fn) => fn(num, str)).filter(
      (s) => !s.includes("undefined")
    ).slice(0, 5);
  }, [dataset]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading || !dataset) return;
    setInput("");
    setMessages((p) => [...p, { role: "user", text: question }]);
    setMessages((p) => [...p, { role: "ai", text: "" }]);
    setLoading(true);

    try {
      await streamDataInsights(dataset, question, (chunk) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, text: last.text + chunk };
          return next;
        });
      });
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1].text =
          "⚠️ Could not reach AI service. Check that the backend is running and your API key is set.";
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
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
            transition={{ duration: 0.2 }}
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
                <span className="ai-drawer-title">AI Data Scientist</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {messages.length > 0 && (
                  <button
                    className="btn btn-ghost ai-reset-btn"
                    onClick={() => setMessages([])}
                    title="Clear conversation"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
                <button
                  className="btn btn-ghost"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="ai-messages">
              {messages.length === 0 && (
                <div className="ai-empty-state">
                  <div className="ai-empty-icon">
                    <Bot size={32} />
                  </div>
                  <p className="ai-empty-title">Your AI Data Scientist</p>
                  <p className="ai-empty-desc">
                    Ask anything about your dataset — distributions, outliers,
                    trends, correlations, or ML recommendations.
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
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : (
                    <p className="ai-message-text">{m.text}</p>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 0 && suggestions.length > 0 && (
              <div className="ai-suggestions">
                <p className="ai-suggestions-label">
                  <ChevronDown size={13} /> Suggested questions
                </p>
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

            {/* Input */}
            <div className="ai-input-area">
              <input
                ref={inputRef}
                className="ai-input"
                placeholder="Ask a question about your data..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                className="btn btn-primary ai-send-btn"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
