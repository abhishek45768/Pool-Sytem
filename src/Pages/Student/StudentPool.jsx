import { useState, useEffect } from "react";
import { usePolling } from "../../PollingContext";
import FloatingChat from "../FloatingChat";
import logo from '../../assets/image.png'; 
import { apiRequest } from "../../utils/httpsMethod";
import { useNavigate } from "react-router-dom";

export default function StudentPoll() {
  const { currentPoll, chatMessages, participants, submitVote, sendMessage, setUserRole } = usePolling();

  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
const navigate=useNavigate()
useEffect(() => {
  const name = localStorage.getItem("studentName") || "Student";
  setUserRole("student", name);

  if (currentPoll?.isActive) {
    setTimeLeft(currentPoll.timeLimit);
  }

  // Check if the current poll has been submitted by this student already
  const submittedPollId = localStorage.getItem("submittedPollId");
  if (submittedPollId === currentPoll?._id) {
    setHasVoted(true);
  } else {
    setHasVoted(false);  // Reset if new poll or user hasn't voted
  }
}, [setUserRole, currentPoll]);


  // Timer countdown
  useEffect(() => {
    if (!currentPoll?.isActive) return;

    const pollId = currentPoll._id;
    if (!pollId) return;

    // Clear any old invalid values
    const stored = localStorage.getItem(`pollEnd_${pollId}`);
    let endTime;

    if (!stored || isNaN(Number(stored))) {
      endTime = Date.now() + (currentPoll.timeLimit || 60) * 1000;
      localStorage.setItem(`pollEnd_${pollId}`, endTime.toString());
    } else {
      endTime = Number(stored); // convert string back to number
    }

    console.log("currentPoll", currentPoll);
    console.log("endTime", endTime);

    const tick = setInterval(() => {
      const remaining = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(tick);
        if (!hasVoted) {
          const autoOption = selectedOption || currentPoll.options[0]?._id;
          if (autoOption) submitVote(autoOption);
          setHasVoted(true);
        }
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [currentPoll, hasVoted, selectedOption, submitVote]);

  const handleSubmitVote = () => {
    if (selectedOption && currentPoll) {
      submitVote(selectedOption);
      setHasVoted(true);
      localStorage.setItem("submittedPollId", currentPoll._id); // Store poll ID to prevent resubmission
    }
  };

  const getTotalVotes = () => currentPoll?.totalVotes || 0;
  const getPercentage = (votes) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };
const studId=localStorage.getItem("Std_id")
const getStudentPool=async()=>{
  try {
    const response= await await apiRequest("GET", `participants/${studId}`, {
        });
        if(response.kick_out){
          navigate('/kick-out')
        }
  } catch (error) {
    console.log('error', error)
  }
}
useEffect(() => {
  if (!studId) {
    navigate("/");
    return;
  }

  getStudentPool();


  const interval = setInterval(() => {
    getStudentPool();
  }, 3000);

  return () => clearInterval(interval);
}, [studId, navigate]);

  if (!currentPoll) {
    return (
      <>
        <FloatingChat />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="text-center">
         

<div className="flex justify-center mb-4">
  <img
    src={logo}
    alt="Intervue Poll Logo"
    className="w-36 h-auto object-contain"
  />
</div>


            <div className="animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Wait for the teacher to ask questions..
            </h2>
          </div>
        </div>
      </>
    );
  }

  const showResults = !currentPoll.isActive || hasVoted;

  return (
    <>
      <FloatingChat />
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white shadow rounded-xl p-6">
          {/* Timer */}
          {currentPoll.isActive && !hasVoted && (
            <div className="flex items-center gap-2 text-red-600 font-medium mb-4">
              ⏰ 00:{timeLeft.toString().padStart(2, "0")}
            </div>
          )}

          {/* Question */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{currentPoll.question}</h1>
          </div>

          {/* Options */}
          {!showResults ? (
            <div className="space-y-4">
              {currentPoll.options.map((option) => (
                <div
                  key={option._id}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedOption === option._id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedOption(option._id)}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === option._id ? "border-purple-500 bg-purple-500" : "border-gray-300"
                    }`}
                  >
                    {selectedOption === option._id && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>
                  <span className="text-lg font-medium">{option.text}</span>
                </div>
              ))}
              <button
                onClick={handleSubmitVote}
                disabled={!selectedOption || hasVoted}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentPoll.options.map((option, index) => {
                const percentage = getPercentage(option.votes);
                const isSelected = selectedOption === option._id;

                return (
                  <div key={option._id} className="relative bg-gray-100 rounded-lg overflow-hidden">
                    {/* Background Bar */}
                    <div
                      className={`absolute left-0 top-0 h-full ${
                        isSelected ? "bg-purple-600" : "bg-gray-300"
                      } transition-all`}
                      style={{ width: `${percentage}%` }}
                    ></div>

                    {/* Foreground Content */}
                    <div className="relative z-10 flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-purple-600 font-bold border border-purple-500">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">{option.text}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{percentage}%</span>
                    </div>
                  </div>
                );
              })}

              {/* Message below results */}
              <div className="text-center mt-6 font-medium text-gray-600">
                Wait for the teacher to ask a new question..
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


export const clearall = async (req, res) => {
  try {
    // Delete all polls
    await Poll.deleteMany({});

    // Delete all participants
    await Participant.deleteMany({});

    // Notify clients (optional)
    req.io.emit("allCleared");

    res.status(200).json({ message: "All polls and participants have been deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
