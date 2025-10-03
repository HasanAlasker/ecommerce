import React from "react";

export default function Spinner({
  size = "md",
  color = "rgba(255, 56, 93, 1)",
}) {
  const sizes = {
    sm: "20px",
    md: "40px",
    lg: "60px",
    xl: "80px",
  };

  const spinnerStyle = {
    width: sizes[size],
    height: sizes[size],
    border: `4px solid rgba(0, 0, 0, 0.1)`,
    borderTop: `4px solid ${color}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={{ margin: "4rem auto" , display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem'}}>
      <div style={spinnerStyle}></div>
      <div className="priColor mid">Please wait</div>
    </div>
  );
}
