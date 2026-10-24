
import { useState } from "react";
import { chatWithAI } from "../services/api";

function Chat() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const examples = [
    "What is a mutual fund?",
    "What is SIP?",
    "What is diversification?",
  ];

  const sendMessage = async (question = message) => {
    if (!question.trim() || loading) return;

    setMessage(question);
    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const data = await chatWithAI(question);
      setAnswer(data.answer || "No answer was returned.");
      setSources(data.sources || []);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the AI assistant. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={iconStyle}>✦</div>
        <h1 style={{ marginBottom: "8px", color: "#173b70" }}>
          AI Financial Assistant
        </h1>
        <p style={{ color: "#64748b", lineHeight: 1.6 }}>
          Your learning companion for understanding personal finance,
          savings, SIPs, and mutual funds.
        </p>
      </div>

      <div style={chatCardStyle}>
        <label htmlFor="question" style={labelStyle}>
          What would you like to learn today?
        </label>

        <textarea
          id="question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask a financial question..."
          rows={3}
          style={textareaStyle}
        />

        <button
          onClick={() => sendMessage()}
          disabled={loading || !message.trim()}
          style={{
            ...buttonStyle,
            opacity: loading || !message.trim() ? 0.6 : 1,
          }}
        >
          {loading ? "Thinking..." : "Ask AI  →"}
        </button>

        <p style={{ color: "#64748b", fontSize: "14px" }}>
          Try an example question
        </p>

        <div style={examplesStyle}>
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => sendMessage(example)}
              disabled={loading}
              style={exampleButtonStyle}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={resultStyle}>
          Your assistant is preparing an answer...
        </div>
      )}

      {error && (
        <div style={{ ...resultStyle, color: "#b91c1c" }}>
          {error}
        </div>
      )}

      {answer && !loading && (
        <div style={resultStyle}>
          <h2 style={{ color: "#173b70" }}>Answer</h2>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
            {answer}
          </p>

          {sources.length > 0 && (
            <>
              <h3 style={{ color: "#173b70", marginTop: "24px" }}>
                Reference Sources
              </h3>
              <ul>
                {sources.map((source, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    {source.source || "Reference document"}
                    {source.page != null && ` — Page ${source.page}`}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <p style={disclaimerStyle}>
        Educational information only. This assistant does not provide
        personalized financial advice.
      </p>
    </div>
  );
}

const pageStyle = {
  maxWidth: "850px",
  margin: "40px auto",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
  color: "#243247",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px",
};

const iconStyle = {
  fontSize: "32px",
  color: "#2563eb",
  marginBottom: "10px",
};

const chatCardStyle = {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 6px 24px rgba(23, 59, 112, 0.07)",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "12px",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  fontSize: "16px",
  resize: "vertical",
  fontFamily: "Arial, sans-serif",
};

const buttonStyle = {
  display: "block",
  marginTop: "14px",
  padding: "12px 22px",
  background: "#173b70",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
};

const examplesStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const exampleButtonStyle = {
  padding: "10px 14px",
  background: "#eff6ff",
  color: "#173b70",
  border: "1px solid #dbeafe",
  borderRadius: "20px",
  cursor: "pointer",
};

const resultStyle = {
  background: "#ffffff",
  padding: "24px",
  marginTop: "24px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  lineHeight: 1.6,
  overflowWrap: "anywhere",
};

const disclaimerStyle = {
  textAlign: "center",
  color: "#64748b",
  fontSize: "13px",
  marginTop: "24px",
};

export default Chat;
