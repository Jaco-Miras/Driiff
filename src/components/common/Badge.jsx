import React from "react";

const Badge = (props) => {
    const {className = "", label} = props;
    return (
        <div className={`${className} mr-3 d-sm-inline d-none`}>
            <div className={"badge badge-light text-white"}>{label}</div>
        </div>
    )
};

export default Badge;
