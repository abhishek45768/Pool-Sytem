import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/httpsMethod"; // ✅ axios helper
import logo from '../../assets/image.png'; 

const TeacherDashboard = () => {
  const [question, setQuestion] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
  ]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleOptionChange = (id, newText) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, text: newText } : option
      )
    );
  };

  const handleCorrectChange = (id, isCorrect) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, isCorrect } : option
      )
    );
  };

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { id: Date.now(), text: "", isCorrect: false },
    ]);
  };

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    if (!question.trim()) newErrors.question = "Question is required";
    if (options.length < 2) newErrors.options = "At least 2 options required";
    if (options.some((o) => !o.text.trim()))
      newErrors.options = "All options must have text";
    if (!options.some((o) => o.isCorrect))
      newErrors.correct = "Please mark at least one correct answer";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await apiRequest("POST", "/polls", {
        question,
        options,
        timeLimit,
      });

      // reset
      setQuestion("");
      setOptions([
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
      ]);
      setErrors({});
      navigate("/teacher-history");
    } catch (error) {
      console.error("Poll create error:", error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
   
  <img
    src={logo}
    alt="Intervue Poll Logo"
    className="w-36 h-auto object-contain"
  />



        <h1 style={styles.title}>
          Let’s <strong>Get Started</strong>
        </h1>
        <p style={styles.subtitle}>
          you’ll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <label style={styles.sectionTitle}>Enter your question</label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              style={styles.timeDropdown}
            >
              {[30, 60, 90, 120].map((val) => (
                <option key={val} value={val}>
                  {val} seconds
                </option>
              ))}
            </select>
          </div>

          <div style={styles.questionBox}>
            <textarea
              style={styles.textarea}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={100}
            />
            <div style={styles.counter}>{question.length}/100</div>
          </div>
          {errors.question && (
            <div style={{ color: "red", fontSize: 12 }}>{errors.question}</div>
          )}

          {/* Options */}
          <div style={styles.optionHeader}>
            <label style={styles.sectionTitle}>Edit Options</label>
            <span style={styles.optionHeaderRight}>Is it Correct?</span>
          </div>

          {options.map((opt, idx) => (
            <div key={opt.id} style={styles.optionRow}>
              <div style={styles.optionIndex}>{idx + 1}</div>
              <input
                type="text"
                value={opt.text}
                onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                style={styles.optionInput}
              />
              <div style={styles.radioGroup}>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`correct-${opt.id}`}
                    checked={opt.isCorrect === true}
                    onChange={() => handleCorrectChange(opt.id, true)}
                  />
                  <span style={styles.radioText}>Yes</span>
                </label>
                <label style={styles.radioLabel}>
                  <input
                    type="radio"
                    name={`correct-${opt.id}`}
                    checked={opt.isCorrect === false}
                    onChange={() => handleCorrectChange(opt.id, false)}
                  />
                  <span style={styles.radioText}>No</span>
                </label>
              </div>
            </div>
          ))}

          {errors.options && (
            <div style={{ color: "red", fontSize: 12 }}>{errors.options}</div>
          )}
          {errors.correct && (
            <div style={{ color: "red", fontSize: 12 }}>{errors.correct}</div>
          )}

          <button
            type="button"
            onClick={addOption}
            style={styles.addOptionBtn}
          >
            + Add More option
          </button>
          <hr />
          <div style={styles.footer}>
            <button type="submit" style={styles.submitBtn}>
              Ask Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Inline styles
const styles = {
  page: {
    backgroundColor: '#fff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px'
  },
  container: {
    width: '100%',
    maxWidth: '700px',
    fontFamily: 'sans-serif'
  },
  pollBtn: {
    backgroundColor: '#6C63FF',
    color: '#fff',
    borderRadius: '12px',
    border: 'none',
    padding: '6px 12px',
    fontSize: '14px',
    marginBottom: '24px',
    cursor: 'pointer'
  },
  title: {
    fontSize: '28px',
    fontWeight: 400,
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '32px',
    lineHeight: '1.5'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px'
  },
  questionBox: {
    position: 'relative'
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'none'
  },
  counter: {
    position: 'absolute',
    bottom: '8px',
    right: '12px',
    fontSize: '12px',
    color: '#aaa'
  },
  timeDropdown: {


    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9'
  },
  optionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#666',
    // marginBottom: '8px',
    fontWeight: '500'
  },
  optionHeaderRight: {
    // paddingRight: '40px'
    color:"black",
    fontWeight:"bold"
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f7f7f7',
    padding: '10px 12px',
    borderRadius: '8px'
  },
  optionIndex: {
    fontSize: '14px',
    width: '20px'
  },
  optionInput: {
    flex: 1,
    padding: '8px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },
  radioGroup: {
    display: 'flex',
    gap: '12px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px'
  },
  radioText: {
    fontSize: '14px'
  },
  addOptionBtn: {
    backgroundColor: '#fff',
    border: '1px solid #bbb',
    borderRadius: '6px',
    padding: '8px 14px',
    fontSize: '14px',
    color: '#6C63FF',
    cursor: 'pointer',
    alignSelf: 'flex-start'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    // marginTop: '20px'
  },
  submitBtn: {
    backgroundColor: '#6C63FF',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  }
};

export default TeacherDashboard;
