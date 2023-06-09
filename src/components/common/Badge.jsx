import React from "react";

const Badge = (props) => {
  const { className = "", label, badgeClassName = "badge-light text-white" } = props;
  return (
    <div className={`badge-wrapper mr-3 d-sm-inline d-none ${className} `}>
      <div className={`badge ${badgeClassName}`}>{label}</div>
    </div>
  );
};

export default Badge;
