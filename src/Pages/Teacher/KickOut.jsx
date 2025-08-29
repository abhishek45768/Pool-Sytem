import React, { useEffect } from "react";
import logo from "../../assets/image.png";

export default function KickedOut() {
  const handleRedirect = () => {
    localStorage.removeItem("isKickedOut");
    localStorage.removeItem("studentName");
    window.location.href = "/";
  };

  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRedirect();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff", // plain white like screenshot
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "16px",
      }}
    >
      <div style={{ maxWidth: "500px" }}>
        {/* Logo */}
        <div style={{ marginBottom: "24px" }}>
          <img
            src={logo}
            alt="Intervue Poll Logo"
            style={{ width: "140px", margin: "0 auto" }}
          />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "12px",
          }}
        >
          You’ve been Kicked out !
        </h1>

        {/* Description */}
        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          Looks like the teacher had removed you from the poll system. <br />
          Please try again sometime.
        </p>
      </div>
    </div>
  );
}
