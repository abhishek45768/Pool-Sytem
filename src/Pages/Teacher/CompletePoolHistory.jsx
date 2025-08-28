import React, { useEffect } from "react";
import { usePolling } from "../../PollingContext";
import FloatingChat from "../FloatingChat";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const CompletePollHistoryPage = () => {
  const { pollHistory, clearAll } = usePolling();
  const navigate = useNavigate(); // Instantiate useNavigate

  const getPercentage = (votes, total) =>
    total > 0 ? Math.round((votes / total) * 100) : 0;

  const handleClearAll = () => {
    clearAll(); // Call the clearAll function from context
    navigate("/"); // Navigate to the desired route (e.g., home page)
  };

  return (
    <>
      <FloatingChat />
      <div style={styles.container}>
        <h1 style={styles.title}>
          View <span style={styles.bold}>Poll History</span>
        </h1>

        {pollHistory.length === 0 && <p>No polls available yet.</p>}

        {pollHistory.map((poll, index) => {
          const totalVotes = poll.options?.reduce(
            (sum, opt) => sum + opt.votes,
            0
          ) || 0;

          return (
            <div key={poll._id || index} style={styles.pollContainer}>
              <h3 style={styles.questionLabel}>Question {index + 1}</h3>
              <div style={styles.pollCard}>
                <div style={styles.pollHeader}>{poll.question}</div>
                {poll.options?.map((option, idx) => {
                  const percentage = getPercentage(option.votes, totalVotes);
                  return (
                    <div key={option.id || idx} style={styles.optionRow}>
                      <div style={styles.optionLabel}>
                        <div style={styles.optionCircle}>{idx + 1}</div>
                        <span style={styles.optionText}>{option.text}</span>
                      </div>
                      <div style={styles.progressWrapper}>
                        <div
                          style={{
                            ...styles.progressBar,
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                      <div style={styles.percentageText}>{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Button to clear all polls and participants */}
        <button
          style={styles.clearButton}
          onClick={handleClearAll} // Call the clearAll function and navigate
        >
          Clear All Polls & Participants
        </button>

        {/* Floating Chat Icon */}
        <div style={styles.chatButton}>💬</div>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "700px",
    margin: "0 auto",
    fontFamily: "sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
    position: "relative",
  },
  title: {
    fontSize: "24px",
    marginBottom: "30px",
    color: "#111",
  },
  bold: {
    fontWeight: "bold",
  },
  pollContainer: {
    marginBottom: "40px",
  },
  questionLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  pollCard: {
    border: "1px solid #dcdcdc",
    borderRadius: "6px",
    padding: "0",
    overflow: "hidden",
  },
  pollHeader: {
    backgroundColor: "#3c3c3c",
    color: "#fff",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  optionRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 16px",
    borderBottom: "1px solid #f0f0f0",
    backgroundColor: "#fafafa",
  },
  optionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "120px",
  },
  optionCircle: {
    width: "20px",
    height: "20px",
    backgroundColor: "#7366f0",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "12px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: "14px",
  },
  progressWrapper: {
    flex: 1,
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#7366f0",
  },
  percentageText: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#333",
    minWidth: "32px",
    textAlign: "right",
  },
  clearButton: {
    backgroundColor: "#f44336", // Red color
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "12px 24px",
    borderRadius: "8px",
    marginTop: "20px",
    cursor: "pointer",
    border: "none",
  },
  chatButton: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    backgroundColor: "#7366f0",
    color: "#fff",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
};

export default CompletePollHistoryPage;
