import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import StudentSetup from "./Pages/Student/StudentSetup";
import StudentPoll from "./Pages/Student/StudentPool";
import { PollingProvider } from "./PollingContext";
import PollHistory from "./Pages/Teacher/History";
import CompletePollHistoryPage from "./Pages/Teacher/CompletePoolHistory";
import KickedOut from "./Pages/Teacher/KickOut";
function App() {
  return (
    <PollingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-setup" element={<StudentSetup />} />
          <Route path="/student-pool" element={<StudentPoll />} />
          <Route path="/teacher-history" element={<PollHistory />} />
          <Route path="/complete-history" element={<CompletePollHistoryPage />} />
          <Route path="/kick-out" element={< KickedOut/>} />
          
        </Routes>
      </Router>
    </PollingProvider>
  );
}

export default App;
