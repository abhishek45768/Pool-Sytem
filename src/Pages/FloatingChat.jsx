import React, { useState, useEffect } from "react";
import { usePolling } from "../PollingContext";
import { useLocation } from "react-router-dom";  // <-- import useLocation

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const location = useLocation();  // <-- get current location

  const { participants, fetchParticipants, kickParticipant } = usePolling();

  // Dummy chat messages (you can replace with context later)
  const messages = [
    { user: "User 1", text: "Hey There, how can I help?", type: "left" },
    { user: "User 2", text: "Nothing bro..just chill!!!", type: "right" },
  ];

  // Fetch participants when component mounts or when opened
  useEffect(() => {
    if (isOpen && activeTab === "participants") {
      fetchParticipants();
    }
  }, [isOpen, activeTab]);

  // Handle kicking a participant
  const handleKick = (name) => {
    if (window.confirm(`Are you sure you want to kick ${name}?`)) {
      kickParticipant(name);
    }
  };

  // Check if route includes "teacher"
  const isTeacherRoute = location.pathname.includes("teacher");

  return (
    <div className="chat-container">
      <div className="chat-inner">
        {isOpen && (
          <div className="chat-box">
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

            <div className="chat-content">
              {activeTab === "chat" ? (
                <div className="messages">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`message ${msg.type === "left" ? "left" : "right"}`}
                    >
                      <div className="username">{msg.user}</div>
                      <div className="bubble">{msg.text}</div>
                    </div>
                  ))}
                </div>
              ) : (
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
                        className={`participant-name ${!isOnline ? "offline" : ""}`}
                        style={{ opacity: isOnline ? 1 : 0.5 }}
                      >
                        {name} {isOnline ? "" : "(Offline)"}
                      </span>
                      {/* Only show Kick button if isTeacherRoute and participant is online */}
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

        <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          💬
        </button>
      </div>
    </div>
  );
};

export default FloatingChat;
