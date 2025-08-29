import React, { useState, useEffect } from "react";
import { usePolling } from "../PollingContext";
import { useLocation } from "react-router-dom";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [newMessage, setNewMessage] = useState("");
  const location = useLocation();

  const { chatMessages, sendMessage, participants, fetchParticipants, kickParticipant } = usePolling();

  // Fetch participants when switching tab
  useEffect(() => {
    if (isOpen && activeTab === "participants") {
      fetchParticipants();
    }
  }, [isOpen, activeTab]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage("");
  };

  const handleKick = (name) => {
    if (window.confirm(`Are you sure you want to kick ${name}?`)) {
      kickParticipant(name);
    }
  };

  const isTeacherRoute = location.pathname.includes("teacher");

  return (
    <div className="chat-container">
      <div className="chat-inner">
        {isOpen && (
          <div className="chat-box">
            {/* Tabs */}
            <div className="chat-tabs">
              <span
                className={`tab ${activeTab === "chat" ? "active" : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                Chat
              </span>
              <span
                className={`tab ${activeTab === "participants" ? "active" : ""}`}
                onClick={() => setActiveTab("participants")}
              >
                Participants
              </span>
            </div>

            {/* Content */}
            <div className="chat-content">
              {activeTab === "chat" ? (
                <>
                  {/* Messages */}
                  <div className="messages">
                    {chatMessages.length === 0 && (
                      <p style={{ textAlign: "center", color: "#777" }}>
                        No messages yet...
                      </p>
                    )}
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`message ${
                          msg.userType === "teacher" ? "left" : "right"
                        }`}
                      >
                        <div className="username">{msg.user}</div>
                        <div className="bubble">{msg.message}</div>
                        <div className="timestamp">{msg.timestamp}</div>
                      </div>
                    ))}
                  </div>

                  {/* Input Box */}
                  {/* Input Box */}
<div
  className="chat-input"
  style={{
    display: "flex",
    alignItems: "center",
    padding: "8px",
    borderTop: "1px solid #ddd",
    background: "#f9fafb",
  }}
>
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Type a message..."
    onKeyDown={(e) => e.key === "Enter" && handleSend()}
    style={{
      flex: 1,
      padding: "10px 14px",
      borderRadius: "20px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "14px",
      marginRight: "8px",
    }}
  />
  <button
    onClick={handleSend}
    style={{
      backgroundColor: "#6C63FF",
      color: "white",
      border: "none",
      padding: "10px 18px",
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background 0.2s",
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#5750d6")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#6C63FF")}
  >
    Send
  </button>
</div>

                </>
              ) : (
                // Participants Tab
                <div className="participants">
                  <h4>Participants</h4>
                  {participants.length === 0 && <p>No participants found.</p>}
                  {participants.map(({ name, isOnline }, idx) => (
                    <div
                      key={idx}
                      className="participant-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.25rem 0",
                      }}
                    >
                      <span
                        className={`participant-name ${
                          !isOnline ? "offline" : ""
                        }`}
                        style={{ opacity: isOnline ? 1 : 0.5 }}
                      >
                        {name} {isOnline ? "" : "(Offline)"}
                      </span>
                      {isTeacherRoute && isOnline && (
                        <button
                          onClick={() => handleKick(name)}
                          style={{
                            backgroundColor: "#e53e3e",
                            color: "white",
                            border: "none",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                          title={`Kick ${name}`}
                        >
                          Kick
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Button */}
        <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          💬
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
