import React, { useState, useRef, useEffect, useMemo } from "react";
import { Drawer, Button, List, Spin, Tag, Typography } from "antd";
import { RobotOutlined, BulbOutlined, RedoOutlined } from "@ant-design/icons";
import { useCsvStore } from "../../store/useCsvStore";
import { streamDataInsights } from "../../features/ai/aiService";

const { Text } = Typography;

export const AIChatDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);

  const dataset = useCsvStore((state) => state.dataset);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (!dataset) return [];

    const cols = dataset.columns;
    const numeric = cols.filter((c) => c.type === "number").map((c) => c.name);
    const dates = cols.filter((c) => c.type === "date").map((c) => c.name);
    const strings = cols.filter((c) => c.type === "string").map((c) => c.name);

    const qs: string[] = [];

    // Trend Analysis
    if (dates.length > 0 && numeric.length > 0) {
      qs.push(`How does ${numeric[0]} change over time?`);
    }

    // Distribution
    if (numeric.length > 0) {
      qs.push(`What is the distribution of ${numeric[0]}?`);
      qs.push(`Identify outliers in ${numeric[0]}.`);
    }

    // Categorical Analysis
    if (strings.length > 0) {
      qs.push(`What are the most common values in ${strings[0]}?`);
    }

    // General
    qs.push("Summarize the key trends in this dataset.");

    return qs.slice(0, 5);
  }, [dataset]);

  // Auto-scroll logic
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleSelectQuestion = async (question: string) => {
    if (loading || !dataset) return;

    setLoading(true);

    // Add User Selection to Chat
    setHistory((prev) => [...prev, { role: "user", text: question }]);

    // Add AI Placeholder
    setHistory((prev) => [...prev, { role: "ai", text: "" }]);

    try {
      await streamDataInsights(dataset, question, (chunk) => {
        setHistory((prev) => {
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          newHistory[lastIndex] = {
            ...newHistory[lastIndex],
            text: newHistory[lastIndex].text + chunk,
          };
          return newHistory;
        });
      });
    } catch (error) {
      setHistory((prev) => {
        const h = [...prev];
        h[h.length - 1].text = "Error: Could not fetch insights.";
        return h;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHistory([]);
  };

  return (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<RobotOutlined />}
        size="large"
        className="position-fixed bottom-0 end-0 m-4 shadow-lg"
        style={{ zIndex: 1000, width: "60px", height: "60px" }}
        onClick={() => setOpen(true)}
      />

      <Drawer
        title={
          <div className="d-flex justify-content-between align-items-center w-100">
            <span>
              <RobotOutlined className="me-2" /> AI Analyst
            </span>
            {history.length > 0 && (
              <Button
                type="text"
                icon={<RedoOutlined />}
                onClick={handleReset}
                size="small"
              >
                Clear
              </Button>
            )}
          </div>
        }
        onClose={() => setOpen(false)}
        open={open}
        width={450}
        styles={{
          body: { paddingBottom: 0, display: "flex", flexDirection: "column" },
        }}
      >
        {/* Chat History Area */}
        <div className="flex-grow-1 overflow-auto p-2">
          {history.length === 0 && (
            <div className="text-center text-muted mt-5">
              <BulbOutlined
                style={{
                  fontSize: "48px",
                  marginBottom: "16px",
                  color: "#d9d9d9",
                }}
              />
              <p>Select a question below to analyze your data instantly.</p>
            </div>
          )}

          <List
            dataSource={history}
            split={false}
            renderItem={(item) => (
              <div
                className={`mb-3 p-3 rounded-3 shadow-sm ${
                  item.role === "ai"
                    ? "bg-light border text-dark"
                    : "bg-primary text-white ms-auto"
                }`}
                style={{
                  maxWidth: "85%",
                  marginLeft: item.role === "user" ? "auto" : "0",
                  marginRight: item.role === "ai" ? "auto" : "0",
                  whiteSpace: "pre-line",
                  fontSize: "0.95rem",
                }}
              >
                {item.text}
                {loading && item.role === "ai" && item.text === "" && (
                  <Spin size="small" />
                )}
              </div>
            )}
          />
          <div ref={bottomRef} />
        </div>

        <div
          className="p-3 bg-white border-top shadow-sm"
          style={{ zIndex: 10 }}
        >
          <Text
            strong
            className="d-block mb-2 text-muted"
            style={{ fontSize: "12px" }}
          >
            SUGGESTED ANALYTICS
          </Text>
          <div className="d-flex flex-wrap gap-2">
            {suggestions.map((q, i) => (
              <Tag.CheckableTag
                key={i}
                checked={false}
                onChange={() => handleSelectQuestion(q)}
                className="px-3 py-2 border rounded-pill user-select-none"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  backgroundColor: "#f0f5ff",
                  borderColor: "#adc6ff",
                  color: "#2f54eb",
                  fontSize: "13px",
                }}
              >
                {q}
              </Tag.CheckableTag>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
};
