import React from "react";

const Badge = (props) => {
    const {className = "", label, badgeClassName = "badge-light"} = props;
    return (
        <div className={`${className} mr-3 d-sm-inline d-none`}>
            <div className={`badge ${badgeClassName} text-white`}>{label}</div>
        </div>
    )
};

export default Badge;
