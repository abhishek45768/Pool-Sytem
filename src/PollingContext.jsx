import { createContext, useContext, useState, useEffect, useRef } from "react";
import { apiRequest } from "./utils/httpsMethod";
import io from "socket.io-client";

const PollingContext = createContext(undefined);

export function PollingProvider({ children }) {
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [studentName, setStudentName] = useState("");
  const socketRef = useRef(null); // ✅ store socket in ref

  // Initialize socket only once
  useEffect(() => {
    const socket = io("https://pooling-system-2ccfb.web.app"); // ✅ local or env var
    socketRef.current = socket;

    // 🔁 Events
    // socket.on("newPoll", (poll) => {
    //   setCurrentPoll(poll);
    //   setParticipants(poll.participants || []);
    // });

  // inside socket.on("newPoll")
socket.on("newPoll", (poll) => {
  setCurrentPoll(poll);
  setParticipants(poll.participants || []);
  setPollHistory((prev) => [...prev, poll]); // ✅ Add this line
});

// inside socket.on("voteUpdate")
socket.on("voteUpdate", (poll) => {
  setCurrentPoll(poll);
  setPollHistory((prev) =>
    prev.map((p) => (p._id === poll._id ? poll : p)) // ✅ Update pollHistory with the latest votes
  );
});


    socket.on("chatMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    socket.on("studentJoined", (student) => {
      setParticipants((prev) => [...prev, { name: student.name, isOnline: true }]);
    });

    socket.on("studentLeft", ({ name }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.name === name ? { ...p, isOnline: false } : p
        )
      );
    });

    return () => {
      socket.disconnect(); // ✅ cleanup
    };
  }, []);

  // Fetch initial polls
   const fetchPolls = async () => {
      try {
        const data = await apiRequest("GET", "/polls");
        if (data.length > 0) {
          setPollHistory(data);
          setCurrentPoll(data.find((p) => p.isActive) || null);
        }
      } catch (err) {
        console.error("Error fetching polls", err);
      }
    };
  useEffect(() => {
   
    fetchPolls();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      autoEndExpiredPolls();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const autoEndExpiredPolls = async () => {
    try {
      await apiRequest("POST", "/polls/auto-end");
    } catch (error) {
      console.error("Error auto-ending expired polls:", error);
    }
  };

  const createPoll = async (question, options, timeLimit) => {
    try {
      const poll = await apiRequest("POST", "/polls", { question, options, timeLimit });
      setCurrentPoll(poll);
      socketRef.current?.emit("newPoll", poll); // ✅ emit via ref
    } catch (err) {
      console.error("Create poll error:", err);
    }
  };

  const submitVote = async (optionId) => {
    if (!currentPoll) return;
    try {
      const poll = await apiRequest("POST", `/polls/${currentPoll._id}/vote`, { optionId });
      setCurrentPoll(poll);
      socketRef.current?.emit("voteUpdate", poll); // ✅ emit via ref
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  const sendMessage = (message) => {
    const msg = {
      id: Date.now().toString(),
      user: isTeacher ? "Teacher" : studentName || "Student",
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      userType: isTeacher ? "teacher" : "student",
    };
    setChatMessages((prev) => [...prev, msg]);
    socketRef.current?.emit("chatMessage", msg); // ✅ emit via ref
  };

  const clearAll = async () => {
  try {
    const response = await apiRequest("POST", "/polls/clearall"); // POST request to the clearall endpoint
    console.log(response.message); // Log success message (optional)
    
    // You can reset state here after clearing everything (if needed)
    setPollHistory([]);
    setCurrentPoll(null);
    setParticipants([]);
    setChatMessages([]);
    localStorage.clear()
    // Optionally, emit a socket event to notify clients
    socketRef.current?.emit("allCleared");
  } catch (error) {
    console.error("Error clearing all polls and participants:", error);
  }
};
// Inside PollingProvider:

// Fetch all participants from API and update state
const fetchParticipants = async () => {
  try {
    const data = await apiRequest("GET", "/participants");
    setParticipants(data);
  } catch (error) {
    console.error("Error fetching participants:", error);
  }
};

// Kick a participant by name, then refresh participants list
const kickParticipant = async (name) => {
  try {
    await apiRequest("POST", "/participants/kick", { name });
    // Update local participants state by removing or marking offline
    setParticipants((prev) =>
      prev.map((p) =>
        p.name === name ? { ...p, isOnline: false } : p
      )
    );
    // Optionally, refetch participants list from server:
    // await fetchParticipants();
  } catch (error) {
    console.error("Error kicking participant:", error);
  }
};

  const setUserRole = (role, name) => {
    setIsTeacher(role === "teacher");
    if (name) setStudentName(name);

    if (role === "student" && name) {
      socketRef.current?.emit("joinParticipant", { name }); // ✅ emit via ref
    }
  };

  const getPollHistory = () => pollHistory;

  return (
    <PollingContext.Provider
      value={{
        currentPoll,
        pollHistory,
        chatMessages,
        participants,
        isTeacher,
        studentName,
        createPoll,
        submitVote,
        sendMessage,
        setUserRole,
        getPollHistory,
        fetchPolls,
        clearAll,
        fetchParticipants,
        kickParticipant
      }}
    >
      {children}
    </PollingContext.Provider>
  );
}

export function usePolling() {
  const context = useContext(PollingContext);
  if (context === undefined) {
    throw new Error("usePolling must be used within a PollingProvider");
  }
  return context;
}
