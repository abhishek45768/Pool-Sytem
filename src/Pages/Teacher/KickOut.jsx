import React from "react";
import logo from '../../assets/image.png'; 

export default function KickedOut() {
  const handleTryAgain = () => {
    localStorage.removeItem("isKickedOut");
    localStorage.removeItem("studentName");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #faf5ff, #ebf8ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "400px",
          background: "#fff",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Badge */}
       <div className="flex justify-center mb-4">
  <img
    src={logo}
    alt="Intervue Poll Logo"
    className="w-36 h-auto object-contain"
  />
</div>


        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          You've been Kicked out!
        </h1>

        {/* Description */}
        <p
          style={{
            color: "#4b5563",
            marginBottom: "32px",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          Looks like the teacher removed you from the poll system. Please try
          again sometime.
        </p>

        {/* Button */}
        <button
          onClick={handleTryAgain}
          style={{
            backgroundColor: "#6C63FF",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#5a54d6")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6C63FF")}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
