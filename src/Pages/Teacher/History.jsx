import React from "react";
import { usePolling } from "../../PollingContext";
import FloatingChat from "../FloatingChat";

export default function PollHistory() {
  const { pollHistory, currentPoll, setUserRole, fetchPolls } = usePolling();
  
  // Dummy state to force re-render every 5 seconds
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    setUserRole("teacher");
  }, [setUserRole]);

  // Poll data refetch every 5 seconds and force update
  React.useEffect(() => {
    fetchPolls(); // initial fetch
    const interval = setInterval(() => {
      fetchPolls();
      setTick((t) => t + 1);  // force re-render
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Prefer current active poll, else fallback to last in history
  const latestPoll = currentPoll || pollHistory[pollHistory.length - 1];

  const getPercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <>
      <FloatingChat />

      <div style={styles.page}>
        {/* Top right button */}
        <button
          style={styles.viewHistoryBtn}
          onClick={() => (window.location.href = "/complete-history")}
        >
          👁 View Poll history
        </button>

        {/* Centered poll box */}
        <div style={styles.card}>
          <h2 style={styles.heading}>Question</h2>

          <div style={styles.pollBox}>
            <div style={styles.questionHeader}>
              {latestPoll?.question || "Which planet is known as the Red Planet?"}
            </div>

            {(latestPoll?.options || sampleOptions).map((opt, index) => {
              const percentage = getPercentage(
                opt.votes,
                latestPoll?.totalVotes || 100
              );
              return (
                <div key={index} style={styles.optionWrapper}>
                  <div style={styles.optionRow}>
                    <div style={styles.optionText}>{opt.text}</div>
                    <div style={styles.percent}>{percentage}%</div>
                  </div>
                  <div style={styles.barBackground}>
                    <div style={{ ...styles.barFill, width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Center Button */}
          <button
            style={styles.askNewBtn}
            onClick={() => (window.location.href = "/teacher-dashboard")}
          >
            + Ask a new question
          </button>
        </div>
      </div>
    </>
  );
}

// Sample data for empty fallback
const sampleOptions = [
  { text: "Mars", votes: 75 },
  { text: "Venus", votes: 5 },
  { text: "Jupiter", votes: 5 },
  { text: "Saturn", votes: 15 },
];

const styles = {
  page: {
    background: "#fff",
    minHeight: "100vh",
    padding: "40px",
    position: "relative",
    fontFamily: "sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  viewHistoryBtn: {
    position: "absolute",
    top: "30px",
    right: "40px",
    backgroundColor: "#8b5cf6",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "14px",
    cursor: "pointer",
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    alignSelf: "flex-start",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  pollBox: {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  questionHeader: {
    backgroundColor: "#4b5563",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: "600",
    fontSize: "14px",
  },
  optionWrapper: {
    padding: "10px 16px",
    backgroundColor: "#f9fafb",
  },
  optionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    marginBottom: "4px",
    color: "#374151",
  },
  optionText: {
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
  },
  percent: {
    fontWeight: "600",
  },
  barBackground: {
    height: "10px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
    borderRadius: "4px",
  },
  askNewBtn: {
    marginTop: "24px",
    backgroundColor: "#8b5cf6",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};
